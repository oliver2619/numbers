import { Injectable } from '@angular/core';
import { Game, NewGameSettings } from 'src/model/game';
import { GameJson1 } from 'src/model/game-json-1';
import { GameJson2 } from 'src/model/game-json-2';
import { SvgAdapter } from 'src/model/svg-adapter';
import { HiscoreService } from '../shared/hiscore.service';
import { LocalStoreService } from '../shared/local-store.service';

export interface SavedGameInfo {
  key: string;
  size: number;
  withItems: boolean;
  saved: Date;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private static readonly KEY1 = 'game';
  private static readonly KEY2_PREFIX = 'game:';

  private game?: Game;
  private adapter?: SvgAdapter;

  get canCleanup(): boolean {
    return this.game !== undefined && this.game.canCleanup;
  }

  get canDelete(): boolean {
    return this.game !== undefined && this.game.canDelete;
  }

  get canInjectNew(): boolean {
    return this.game !== undefined && this.game.canInjectNew;
  }

  get canPauseInject(): boolean {
    return this.game !== undefined && this.game.canPauseInject;
  }

  get canResume(): boolean {
    return this.listSavedGames().length > 0;
  }

  get canUndo(): boolean {
    return this.game !== undefined && this.game.canUndo;
  }

  get costsCleanup(): number {
    return this.game !== undefined ? this.game.costsCleanup : 0;
  }

  get costsDelete(): number {
    return this.game !== undefined ? this.game.costsDelete : 0;
  }

  get costsInjectNew(): number {
    return this.game !== undefined ? this.game.costsInjectNew : 0;
  }

  get costsPauseInject(): number {
    return this.game !== undefined ? this.game.costsPauseInject : 0;
  }

  get costsUndo(): number {
    return this.game !== undefined ? this.game.costsUndo : 0;
  }

  get hasGame(): boolean {
    return this.game !== undefined;
  }

  get isAnimating(): boolean {
    return false;
  }

  get isOver(): boolean {
    return this.game === undefined || this.game.isOver;
  }

  get score(): number {
    return this.game !== undefined ? this.game.score : 0;
  }

  get withItems(): boolean {
    return this.game !== undefined ? this.game.withItems : false;
  }

  constructor(private readonly localStoreService: LocalStoreService, private readonly hiscoreService: HiscoreService) {
    this.migrate1To2();
  }

  cleanup() {
    this.game?.cleanup();
    this.save();
  }

  deleteOne() {
    this.game?.deleteOne();
    this.save();
  }

  endGame() {

  }

  injectNew() {
    this.game?.injectNew();
    this.save();
  }

  listSavedGames(): SavedGameInfo[] {
    return this.localStoreService.list(GameService.KEY2_PREFIX).map(it => {
      const json: GameJson2 = this.localStoreService.load(`${GameService.KEY2_PREFIX}${it}`);
      const saved = new Date();
      saved.setTime(json.saved);
      const ret: SavedGameInfo = {
        saved,
        key: it,
        score: json.history[json.history.length - 1].score,
        size: Math.sqrt(json.history[0].numbers.length) | 0,
        withItems: json.withItems
      };
      return ret;
    });
  }

  moved(x: number, y: number) {
    this.convertDirection(x, y, (dx, dy, __) => {
      this.movedByKeyboard(dx, dy);
    });
  }

  movedByKeyboard(dx: number, dy: number) {
    if (this.game !== undefined && this.game.canMove(dx, dy)) {
      this.game.move(dx, dy);
      this.hiscoreService.save(this.game.size, this.game.withItems, this.game.score, this.game.maxNumber);
      if (this.game.isOver) {
        this.remove();
      } else {
        this.save();
      }
    }
  }

  moving(x: number, y: number) {

  }

  newGame(settings: NewGameSettings) {
    this.game = Game.newGame(settings);
    this.save();
  }

  pauseInject() {
    this.game?.pauseInject();
    this.save();
  }

  resume(key: string) {
    const json: GameJson2 = this.localStoreService.load(`${GameService.KEY2_PREFIX}${key}`);
    this.game = Game.load(json);
  }

  resumeLast() {
    const games = this.listSavedGames();
    if (games.length > 0) {
      games.sort((g1, g2) => g2.saved.getTime() - g1.saved.getTime());
      this.resume(games[0].key);
    }
  }

  undo() {
    this.game?.undo();
    this.save();
  }

  updateSvg(element: SVGSVGElement) {
    this.adapter = new SvgAdapter(element);
    this.game?.updateSvg(this.adapter);
  }

  private static getKey(size: number, withItems: boolean): string {
    const level = withItems ? 'easy' : 'hard';
    return `${GameService.KEY2_PREFIX}${size}:${level}`;
  }

  private convertDirection(x: number, y: number, callback: (x: number, y: number, distance: number) => void) {
    if (this.adapter !== undefined && this.adapter.isMovedOverThreshold(Math.max(Math.abs(x), Math.abs(y)))) {
      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0) {
          callback(1, 0, x);
        } else {
          callback(-1, 0, -x);
        }
      } else {
        if (y > 0) {
          callback(0, 1, y);
        } else {
          callback(0, -1, -y);
        }
      }
    }
  }

  private migrate1To2() {
    if (this.localStoreService.has(GameService.KEY1)) {
      const json1: GameJson1 = this.localStoreService.load(GameService.KEY1);
      const json2: GameJson2 = {
        version: 2,
        saved: new Date().getTime(),
        withItems: json1.withItems,
        history: [{
          numbers: json1.numbers,
          score: json1.score,
          lastInjectionPosition: json1.lastInjectionPosition
        }]
      };
      this.localStoreService.save(GameService.getKey(Math.sqrt(json1.numbers.length) | 0, json2.withItems), json2);
      this.localStoreService.remove(GameService.KEY1);
    }
  }

  private remove() {
    if (this.game !== undefined) {
      this.localStoreService.remove(GameService.getKey(this.game.size, this.game.withItems));
    }
  }

  private save() {
    if (this.game !== undefined) {
      const json = this.game.save();
      this.localStoreService.save(GameService.getKey(this.game.size, this.game.withItems), json);
    }
  }
}
