import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const modal = inject(ModalService);

  if (authService.isLoggedIn()) {
    return true;
  }

  // state.url es la ruta completa que el usuario intentaba visitar
  // (ej. "/favorites"). La guardamos para volver ahí tras el login.
  router.navigate(['/']);
  modal.openLogin(state.url);
  return false;
};