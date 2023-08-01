import { GameJson2, GameStateJson2 } from "./game-json-2";
import { SvgAdapter } from "./svg-adapter";

export interface NewGameSettings {
    size: 3 | 4 | 5;
    items: boolean;
}

class GameState {

    constructor(readonly numbers: Array<number | undefined>, public score: number, public lastInjectionPosition: number | undefined) { }

    static load(json: GameStateJson2): GameState {
        return new GameState(json.numbers.map(it => it !== null ? it : undefined), json.score, json.lastInjectionPosition);
    }

    copy(): GameState {
        return new GameState(this.numbers.slice(0), this.score, this.lastInjectionPosition);
    }

    save(): GameStateJson2 {
        const ret: GameStateJson2 = {
            numbers: this.numbers.map(it => it !== undefined ? it : null),
            score: this.score,
            lastInjectionPosition: this.lastInjectionPosition
        };
        return ret;
    }
}

export class Game {

    private static readonly MAX_UNDO_LEVELS = 5;
    private static readonly MAX_STATE_SIZE = Game.MAX_UNDO_LEVELS + 1;

    readonly size: number;

    private readonly states: GameState[];

    private adapter?: SvgAdapter;

    get canCleanup(): boolean {
        return this._score >= this.costsCleanup;
    }

    get canDelete(): boolean {
        return this._score >= this.costsDelete && this.usedFields > 1;
    }

    get canInjectNew(): boolean {
        return this._score >= this.costsInjectNew && this.lastInjectionPosition !== undefined;
    }

    get canPauseInject(): boolean {
        return this._score >= this.costsPauseInject && this.lastInjectionPosition !== undefined;
    }

    get canUndo(): boolean {
        return this.states.length > 1 && this.states[this.states.length - 2].score >= this.costsUndo;
    }

    get costsCleanup(): number {
        return this.minNumber * 1600;
    }

    get costsDelete(): number {
        return this.minNumber * 400;
    }

    get costsInjectNew(): number {
        return this.minNumber * 100;
    }

    get costsPauseInject(): number {
        return this.minNumber * 200;
    }

    get costsUndo(): number {
        return this.minNumber * 800;
    }

    get maxNumber(): number {
        return 1 << this.maxNumberIndex;
    }

    get maxNumberIndex(): number {
        const nonNulls = <number[]>this.numbers.filter(it => it !== undefined);
        return Math.max.apply(Math, nonNulls);
    }

    private get minNumber(): number {
        return 1 << this.minNumberIndex;
    }

    get minNumberIndex(): number {
        const nonNulls = <number[]>this.numbers.filter(it => it !== undefined);
        return Math.min.apply(Math, nonNulls);
    }

    get usedFields(): number {
        return this.numbers.filter(it => it !== undefined).length;
    }

    get score(): number {
        return this._score;
    }

    get isOver(): boolean {
        return !(this.canMoveDown() || this.canMoveUp() || this.canMoveLeft() || this.canMoveRight());
    }

    private get lastInjectionPosition(): number | undefined {
        return this.states[this.states.length - 1].lastInjectionPosition;
    }

    private set lastInjectionPosition(p: number | undefined) {
        this.states[this.states.length - 1].lastInjectionPosition = p;
    }

    private get numbers(): Array<number | undefined> {
        return this.states[this.states.length - 1].numbers;
    }

    private get _score(): number {
        return this.states[this.states.length - 1].score;
    }

    private set _score(s: number) {
        this.states[this.states.length - 1].score = s;
    }

    private constructor(states: GameState[], readonly withItems: boolean) {
        this.size = Math.sqrt(states[0].numbers.length) | 0;
        this.states = states.map(it => new GameState(it.numbers.slice(0), it.score, it.lastInjectionPosition));
    }

    canMove(x: number, y: number): boolean {
        if (x < 0) {
            return this.canMoveLeft();
        } else if (x > 0) {
            return this.canMoveRight();
        } else if (y < 0) {
            return this.canMoveDown();
        } else if (y > 0) {
            return this.canMoveUp();
        } else {
            return false;
        }
    }

    cleanup() {
        this.addState();
        this._score -= this.costsCleanup;
        this.numbers.sort((n1, n2) => {
            const v1: number = n1 !== undefined ? n1 : -1;
            const v2: number = n2 !== undefined ? n2 : -1;
            return v2 - v1;
        });
        this.lastInjectionPosition = undefined;
    }

    deleteOne() {
        this.addState();
        this._score -= this.costsDelete;
        this.setFieldAtIndex(this.getRandomField(), undefined);
    }

    injectNew() {
        if (this.lastInjectionPosition !== undefined) {
            this.addState();
            this._score -= this.costsInjectNew;
            this.setFieldAtIndex(this.lastInjectionPosition, undefined);
            this.injectNumber();
        }
    }

    move(x: number, y: number) {
        if (x < 0) {
            this.addState();
            this.moveLeft();
            this.injectNumber();
        } else if (x > 0) {
            this.addState();
            this.moveRight();
            this.injectNumber();
        } else if (y < 0) {
            this.addState();
            this.moveDown();
            this.injectNumber();
        } else if (y > 0) {
            this.addState();
            this.moveUp();
            this.injectNumber();
        }
    }

    pauseInject() {
        if (this.lastInjectionPosition !== undefined) {
            this.addState();
            this._score -= this.costsPauseInject;
            this.setFieldAtIndex(this.lastInjectionPosition, undefined);
        }
    }

    save(): GameJson2 {
        const ret: GameJson2 = {
            version: 2,
            saved: new Date().getTime(),
            withItems: this.withItems,
            history: this.states.map(it => it.save())
        };
        return ret;
    }

    undo() {
        if (this.states.length > 1) {
            this.states.pop();
            const c = this.costsUndo;
            this.states.forEach(it => it.score -= c);
        }
    }

    updateSvg(adapter: SvgAdapter) {
        this.adapter = adapter;
        this.adapter.init(Math.sqrt(this.numbers.length) | 0);
        this.numbers.forEach((value, index) => {
            if (value !== undefined) {
                adapter.number(index, value);
            }
        });
    }

    private addState() {
        const last = this.states[this.states.length - 1];
        this.states.push(last.copy());
        while (this.states.length > Game.MAX_STATE_SIZE) {
            this.states.shift();
        }
    }

    private canMoveLeft(): boolean {
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size - 1; ++x) {
                if (this.getField(x, y) === undefined && this.getField(x + 1, y) !== undefined) {
                    return true;
                }
                if (this.getField(x, y) !== undefined && this.getField(x, y) === this.getField(x + 1, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    private canMoveRight(): boolean {
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size - 1; ++x) {
                if (this.getField(x + 1, y) === undefined && this.getField(x, y) !== undefined) {
                    return true;
                }
                if (this.getField(x, y) !== undefined && this.getField(x, y) === this.getField(x + 1, y)) {
                    return true;
                }
            }
        }
        return false;
    }

    private canMoveDown(): boolean {
        for (let x = 0; x < this.size; ++x) {
            for (let y = 0; y < this.size - 1; ++y) {
                if (this.getField(x, y) === undefined && this.getField(x, y + 1) !== undefined) {
                    return true;
                }
                if (this.getField(x, y) !== undefined && this.getField(x, y) === this.getField(x, y + 1)) {
                    return true;
                }
            }
        }
        return false;

    }

    private canMoveUp(): boolean {
        for (let x = 0; x < this.size; ++x) {
            for (let y = 0; y < this.size - 1; ++y) {
                if (this.getField(x, y + 1) === undefined && this.getField(x, y) !== undefined) {
                    return true;
                }
                if (this.getField(x, y) !== undefined && this.getField(x, y) === this.getField(x, y + 1)) {
                    return true;
                }
            }
        }
        return false;
    }

    private moveLeft() {
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size - 1; ++x) {
                if (this.getField(x, y) === undefined) {
                    for (let i = x + 1; i < this.size; ++i) {
                        if (this.getField(i, y) !== undefined) {
                            this.setField(x, y, this.getField(i, y));
                            this.setField(i, y, undefined);
                            break;
                        }
                    }
                }
                if (this.getField(x, y) !== undefined) {
                    for (let i = x + 1; i < this.size; ++i) {
                        if (this.getField(i, y) !== undefined) {
                            if (this.getField(x, y) === this.getField(i, y)) {
                                this.setField(x, y, this.getField(x, y)! + 1);
                                this.setField(i, y, undefined);
                                this._score += 1 << this.getField(x, y)!;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    private moveRight() {
        for (let y = 0; y < this.size; ++y) {
            for (let x = this.size - 1; x > 0; --x) {
                if (this.getField(x, y) === undefined) {
                    for (let i = x - 1; i >= 0; --i) {
                        if (this.getField(i, y) !== undefined) {
                            this.setField(x, y, this.getField(i, y));
                            this.setField(i, y, undefined);
                            break;
                        }
                    }
                }
                if (this.getField(x, y) !== undefined) {
                    for (let i = x - 1; i >= 0; --i) {
                        if (this.getField(i, y) !== undefined) {
                            if (this.getField(x, y) === this.getField(i, y)) {
                                this.setField(x, y, this.getField(x, y)! + 1);
                                this.setField(i, y, undefined);
                                this._score += 1 << this.getField(x, y)!;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    private moveDown() {
        for (let x = 0; x < this.size; ++x) {
            for (let y = 0; y < this.size - 1; ++y) {
                if (this.getField(x, y) === undefined) {
                    for (let i = y + 1; i < this.size; ++i) {
                        if (this.getField(x, i) !== undefined) {
                            this.setField(x, y, this.getField(x, i));
                            this.setField(x, i, undefined);
                            break;
                        }
                    }
                }
                if (this.getField(x, y) !== undefined) {
                    for (let i = y + 1; i < this.size; ++i) {
                        if (this.getField(x, i) !== undefined) {
                            if (this.getField(x, y) === this.getField(x, i)) {
                                this.setField(x, y, this.getField(x, y)! + 1);
                                this.setField(x, i, undefined);
                                this._score += 1 << this.getField(x, y)!;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    private moveUp() {
        for (let x = 0; x < this.size; ++x) {
            for (let y = this.size - 1; y > 0; --y) {
                if (this.getField(x, y) === undefined) {
                    for (let i = y - 1; i >= 0; --i) {
                        if (this.getField(x, i) !== undefined) {
                            this.setField(x, y, this.getField(x, i));
                            this.setField(x, i, undefined);
                            break;
                        }
                    }
                }
                if (this.getField(x, y) !== undefined) {
                    for (let i = y - 1; i >= 0; --i) {
                        if (this.getField(x, i) !== undefined) {
                            if (this.getField(x, y) === this.getField(x, i)) {
                                this.setField(x, y, this.getField(x, y)! + 1);
                                this.setField(x, i, undefined);
                                this._score += 1 << this.getField(x, y)!;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    private getField(x: number, y: number): number | undefined {
        return this.numbers[x + y * this.size];
    }

    private setField(x: number, y: number, n: number | undefined) {
        this.setFieldAtIndex(x + y * this.size, n);
    }

    private setFieldAtIndex(field: number, n: number | undefined) {
        this.numbers[field] = n;
        if (this.lastInjectionPosition === field && n === undefined) {
            this.lastInjectionPosition = undefined;
        }
        if (this.adapter !== undefined) {
            if (n !== undefined) {
                this.adapter.number(field, n);
            } else {
                this.adapter.clear(field);
            }
        }
    }

    private injectNumber() {
        const i = this.getRandomFreeField();
        this.lastInjectionPosition = i;
        this.numbers[i] = this.getNextInjextNumberIndex();
        if (this.adapter !== undefined) {
            this.adapter.number(i, this.numbers[i]!);
        }
    }

    private getNextInjextNumberIndex(): number {
        const max = Math.max(0, this.maxNumberIndex - this.numbers.length + 2);
        const min = this.minNumberIndex;
        return Math.min(max, min);
    }

    private getRandomField(): number {
        let i = Math.floor(Math.random() * this.usedFields);
        for (let f = 0; f < this.numbers.length; ++f) {
            if (this.numbers[f] !== undefined) {
                if (i === 0) {
                    return f;
                } else {
                    --i;
                }
            }
        }
        throw Error('No field with number found');
    }

    private getRandomFreeField(): number {
        let i = Math.floor(Math.random() * (this.numbers.length - this.usedFields));
        for (let f = 0; f < this.numbers.length; ++f) {
            if (this.numbers[f] === undefined) {
                if (i === 0) {
                    return f;
                } else {
                    --i;
                }
            }
        }
        throw Error('No free field found');
    }

    static newGame(settings: NewGameSettings): Game {
        const numbers = new Array(settings.size * settings.size);
        for (let i = 0; i < numbers.length; ++i) {
            numbers[i] = undefined;
        }
        const states: GameState[] = [new GameState(numbers, 0, undefined)];
        const ret = new Game(states, settings.items);
        ret.injectNumber();
        ret.injectNumber();
        return ret;
    }

    static load(json: GameJson2): Game {
        const states: GameState[] = json.history.map(it => GameState.load(it));
        return new Game(states, json.withItems);
    }
}