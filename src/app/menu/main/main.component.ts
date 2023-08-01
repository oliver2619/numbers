import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameService } from 'src/app/game/game.service';
import packageInfo from '../../../../package.json';

@Component({
  selector: 'n-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  constructor(private readonly gameService: GameService) {  }

  get version(): string {
		return packageInfo.version;
	}

  get canResume(): boolean {
    return this.gameService.canResume;
  }
}
