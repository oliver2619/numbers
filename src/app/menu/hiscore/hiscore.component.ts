import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HiscoreItemJson, HiscoreService } from 'src/app/shared/hiscore.service';

@Component({
  selector: 'n-hiscore',
  templateUrl: './hiscore.component.html',
  styleUrls: ['./hiscore.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HiscoreComponent {

  readonly records: HiscoreItemJson[];

  constructor(hiscoreService: HiscoreService) {
    this.records = hiscoreService.get();
    this.records.sort((i1, i2) => {
      return i2.score - i1.score
    });
  }
}
