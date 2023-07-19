import { GameJson } from "./game-json";
import { SvgAdapter } from "./svg-adapter";

export interface NewGameSettings {
    size: 3 | 4 | 5;
    items: boolean;
}

export class Game {

    readonly size: number;

    private adapter: SvgAdapter | undefined;

    get maxNumber(): number {
        return 1 << this.numbers.reduce((prev: number, cur: number | undefined) => Math.max(prev, cur !== undefined ? cur : 0), 0);
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

    private constructor(private readonly numbers: Array<number | undefined>, private _score: number, private items: string[], readonly withItems: boolean) {
        this.size = Math.sqrt(numbers.length) | 0;
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

    move(x: number, y: number) {
        if (x < 0) {
            this.moveLeft();
            this.injectNumber();
        } else if (x > 0) {
            this.moveRight();
            this.injectNumber();
        } else if (y < 0) {
            this.moveDown();
            this.injectNumber();
        } else if (y > 0) {
            this.moveUp();
            this.injectNumber();
        }
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

    save(): GameJson {
        const ret: GameJson = {
            version: 1,
            numbers: this.numbers.map(it => it !== undefined ? it : null),
            score: this._score,
            items: this.items,
            withItems: this.withItems
        };
        return ret;
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

    private getField(x: number, y: number): number | undefined {
        return this.numbers[x + y * this.size];
    }

    private setField(x: number, y: number, n: number | undefined) {
        this.numbers[x + y * this.size] = n;
        if (this.adapter !== undefined) {
            if (n !== undefined) {
                this.adapter.number(x + y * this.size, n);
            } else {
                this.adapter.clear(x + y * this.size);
            }
        }
    }

    private injectNumber() {
        const i = this.getRandomFreeField();
        this.numbers[i] = 0;
        if (this.adapter !== undefined) {
            this.adapter.number(i, this.numbers[i]!);
        }
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
        const ret = new Game(numbers, 0, [], settings.items);
        ret.injectNumber();
        ret.injectNumber();
        return ret;
    }

    static load(json: GameJson): Game {
        return new Game(json.numbers.map(it => it !== null ? it : undefined), json.score, json.items.slice(0), json.withItems);
    }
}