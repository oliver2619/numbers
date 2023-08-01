import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { jokerGuard } from './game.guard';
import { JokerComponent } from './joker/joker.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [{
  path: 'main',
  component: MainComponent
}, {
  path: 'joker',
  component: JokerComponent,
  canActivate: [jokerGuard]
}, {
  path: '**',
  redirectTo: 'main'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
