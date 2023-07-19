import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MenuRoutingModule } from './menu-routing.module';
import { MainComponent } from './main/main.component';
import { NewGameComponent } from './new-game/new-game.component';
import { HiscoreComponent } from './hiscore/hiscore.component';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MainComponent,
    NewGameComponent,
    HiscoreComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MenuModule { }
