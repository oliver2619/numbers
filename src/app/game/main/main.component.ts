import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'n-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements AfterViewInit, OnDestroy {

  @ViewChild('svg')
  svg: ElementRef<SVGSVGElement> | undefined;

  private pointerIdDown: number | undefined;
  private shiftX = 0;
  private shiftY = 0;

  get score(): number {
    return this.gameService.score;
  }

  get isOver(): boolean {
    return this.gameService.isOver;
  }

  constructor(private readonly gameService: GameService) { }

  ngOnDestroy(): void {
    this.gameService.endGame();
  }

  ngAfterViewInit(): void {
    this.gameService.updateSvg(this.svg!.nativeElement);
  }

  pointerDown(ev: PointerEvent) {
    if (!this.gameService.isAnimating && this.pointerIdDown === undefined && ev.button === 0) {
      this.pointerIdDown = ev.pointerId;
      this.svg!.nativeElement.setPointerCapture(ev.pointerId);
      this.shiftX = 0;
      this.shiftY = 0;
    }
  }

  pointerUp(ev: PointerEvent) {
    if (this.pointerIdDown === ev.pointerId && ev.button === 0) {
      this.pointerIdDown = undefined;
      this.svg!.nativeElement.releasePointerCapture(ev.pointerId);
      this.gameService.moved(this.shiftX, this.shiftY);
    }
  }

  pointerMove(ev: PointerEvent) {
    if (this.pointerIdDown === ev.pointerId) {
      this.shiftX += ev.movementX;
      this.shiftY += ev.movementY;
      this.gameService.moving(this.shiftX, this.shiftY);
    }
  }
}
