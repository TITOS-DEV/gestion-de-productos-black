import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const modal = inject(ModalService);

  if (!authService.isLoggedIn()) {
    // No está logueado: redirigir al home y abrir el modal de login
    router.navigate(['/']);
    modal.openLogin(state.url);
    return false;
  }

  // Verificar si la ruta requiere el rol 'admin'
  const requiredRole = route.data?.['role'];
  if (requiredRole === 'admin' && !authService.isAdmin()) {
    // Está logueado pero no es admin: redirigir al home
    router.navigate(['/']);
    return false;
  }

  return true;
};