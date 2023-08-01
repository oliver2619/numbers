import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'n-joker',
  templateUrl: './joker.component.html',
  styleUrls: ['./joker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JokerComponent {

  get canCleanup(): boolean {
    return this.gameService.canCleanup;
  }

  get canUndo(): boolean {
    return this.gameService.canUndo;
  }

  get canDelete(): boolean {
    return this.gameService.canDelete;
  }

  get canPauseInject(): boolean {
    return this.gameService.canPauseInject;
  }

  get canInjectNew(): boolean {
    return this.gameService.canInjectNew;
  }

  get costsCleanup(): number {
    return this.gameService.costsCleanup;
  }

  get costsUndo(): number {
    return this.gameService.costsUndo;
  }

  get costsDelete(): number {
    return this.gameService.costsDelete;
  }

  get costsPauseInject(): number {
    return this.gameService.costsPauseInject;
  }

  get costsInjectNew(): number {
    return this.gameService.costsInjectNew;
  }

  constructor(private readonly gameService: GameService, private readonly router: Router) { }

  cleanup() {
    this.gameService.cleanup();
    this.navigateBack();
  }

  undo() {
    this.gameService.undo();
    this.navigateBack();
  }

  deleteOne() {
    this.gameService.deleteOne();
    this.navigateBack();
  }

  pauseInject() {
    this.gameService.pauseInject();
    this.navigateBack();
  }

  injectNew() {
    this.gameService.injectNew();
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigateByUrl('/game/main');
  }
}
