import { Injectable } from '@angular/core';
import { Game, NewGameSettings } from 'src/model/game';
import { GameJson } from 'src/model/game-json';
import { SvgAdapter } from 'src/model/svg-adapter';
import { HiscoreService } from '../shared/hiscore.service';
import { LocalStoreService } from '../shared/local-store.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private static readonly KEY = 'game';

  private game: Game | undefined;

  get canResume(): boolean {
    return this.localStoreService.has(GameService.KEY);
  }

  get hasGame(): boolean {
    return this.game !== undefined;
  }

  get isAnimating(): boolean {
    return false;
  }

  get isOver(): boolean {
    return this.game!.isOver;
  }

  get score(): number {
    return this.game!.score;
  }

  constructor(private readonly localStoreService: LocalStoreService, private readonly hiscoreService: HiscoreService) { }

  endGame() {

  }

  moved(x: number, y: number) {
    this.convertDirection(x, y, (dx, dy) => {
      if (this.game!.canMove(dx, dy)) {
        this.game!.move(dx, dy);
        this.hiscoreService.save(this.game!.size, this.game!.withItems, this.game!.score, this.game!.maxNumber);
        if (this.game!.isOver) {
          this.remove();
        } else {
          this.save();
        }
      }
    });
  }

  moving(x: number, y: number) {

  }

  newGame(settings: NewGameSettings) {
    this.game = Game.newGame(settings);
    this.save();
  }

  resume() {
    const json: GameJson = this.localStoreService.load(GameService.KEY);
    this.game = Game.load(json);
  }

  updateSvg(element: SVGSVGElement) {
    this.game!.updateSvg(new SvgAdapter(element))
  }

  private convertDirection(x: number, y: number, callback: (x: number, y: number) => void) {
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) {
        callback(1, 0);
      } else {
        callback(-1, 0);
      }
    } else {
      if (y > 0) {
        callback(0, 1);
      } else {
        callback(0, -1);
      }
    }
  }

  private remove() {
    this.localStoreService.remove(GameService.KEY);
  }

  private save() {
    const json = this.game!.save();
    this.localStoreService.save(GameService.KEY, json);
  }

}
