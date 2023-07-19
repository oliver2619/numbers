import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HiscoreComponent } from './hiscore/hiscore.component';
import { MainComponent } from './main/main.component';
import { NewGameComponent } from './new-game/new-game.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: MainComponent
}, {
  path: 'hiscore',
  component: HiscoreComponent
}, {
  path: 'new-game',
  component: NewGameComponent
}, {
  path: 'settings',
  component: SettingsComponent
}, {
  path: '**',
  redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
