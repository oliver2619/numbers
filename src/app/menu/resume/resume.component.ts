import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/game/game.service';
import { TextService } from 'src/app/shared/text.service';

interface Item {
  key: string;
  size: string;
  level: string;
  score: number;
}

@Component({
  selector: 'n-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResumeComponent {

  readonly games: Item[];

  constructor(private readonly gameService: GameService, private readonly router: Router, private readonly textService: TextService) {
    const gs = this.gameService.listSavedGames();
    gs.sort((g1, g2) => g2.saved.getTime() - g1.saved.getTime());

    this.games = gs.map(it => {
      const ret: Item = {
        key: it.key,
        size: `${it.size}\u00d7${it.size}`,
        level: it.withItems ? this.textService.get('menu.level1') : this.textService.get('menu.level2'),
        score: it.score
      };
      return ret;
    });

  }

  resume(key: string) {
    this.gameService.resume(key);
    this.router.navigateByUrl('game');
  }
}
