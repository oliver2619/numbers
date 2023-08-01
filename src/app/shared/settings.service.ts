import { Injectable } from '@angular/core';
import { Theme } from './settings';
import { LocalStoreService } from './local-store.service';

interface SettingsJson {
  version: 1;
  theme: Theme;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private static readonly KEY = 'settings';

  private _theme: Theme;

  get theme(): Theme {
    return this._theme;
  }

  set theme(t: Theme) {
    if (this._theme !== t) {
      this._theme = t;
      this.save();
    }
  }

  constructor(private readonly localStoreService: LocalStoreService) {
    if (this.localStoreService.has(SettingsService.KEY)) {
      const json: SettingsJson = this.localStoreService.load(SettingsService.KEY);
      this._theme = json.theme;
    } else {
      this._theme = 'bright';
    }
  }

  private save() {
    const json: SettingsJson = {
      version: 1,
      theme: this._theme
    };
    this.localStoreService.save(SettingsService.KEY, json);
  }
}
