import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from 'src/app/game/game.service';

interface NewGameFormValue {
  size: 3 | 4 | 5;
  items: boolean;
}

@Component({
  selector: 'n-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGameComponent {

  readonly formGroup: FormGroup;

  private get value(): NewGameFormValue {
    return this.formGroup.value;
  }

  constructor(private readonly gameService: GameService, private readonly router: Router, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('size', formBuilder.control(4));
    this.formGroup.addControl('items', formBuilder.control(true));
  }

  start() {
    const v = this.value;
    this.gameService.newGame({
      size: v.size,
      items: v.items
    });
    this.router.navigateByUrl('/game/main');
  }
}
