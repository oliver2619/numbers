import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { gameGuard } from './game/game.guard';
import { SplashComponent } from './splash/splash.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: SplashComponent
},{
  path: 'menu',
  loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)
}, {
  path: 'game',
  loadChildren: () => import('./game/game.module').then(m => m.GameModule),
  canActivate: [gameGuard]
}, {
  path: '**',
  redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
