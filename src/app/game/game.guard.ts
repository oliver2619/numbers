import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from './game.service';

export const gameGuard: CanActivateFn = (route, state) => {
  const gameService = inject(GameService);
  if (!gameService.hasGame && gameService.canResume) {
    gameService.resume();
  }
  if (gameService.hasGame) {
    return true;
  } else {
    return inject(Router).createUrlTree(['menu']);
  }
};

export const jokerGuard: CanActivateFn = (route, state) => {
  const gameService = inject(GameService);
  if (gameService.withItems) {
    return true;
  } else {
    return inject(Router).createUrlTree(['game/main']);
  }
};
