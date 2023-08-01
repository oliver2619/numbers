import { Component, HostListener } from '@angular/core';
import { Theme } from './shared/settings';
import { SettingsService } from './shared/settings.service';

@Component({
  selector: 'n-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  get theme(): Theme {
    return this.settingsService.theme;
  }

  constructor(private readonly settingsService: SettingsService) { }

  @HostListener('window:contextmenu', ['$event'])
  contextMenu(ev: MouseEvent) {
    ev.preventDefault();
  }
}
