import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from 'src/app/shared/settings.service';
import { Theme } from '../../shared/settings';

interface SettingsFormValue {
  theme: Theme;
}

@Component({
  selector: 'n-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

  readonly formGroup: FormGroup;

  constructor(settingsService: SettingsService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({});
    this.formGroup.addControl('theme', formBuilder.control(settingsService.theme));
    this.formGroup.valueChanges.subscribe({
      next: (value: SettingsFormValue) => {
        settingsService.theme = value.theme;
      }
    });
  }
}
