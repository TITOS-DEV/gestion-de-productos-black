import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // Token vencido o inválido: limpia la sesión localmente
        // (el backend con JWT no tiene sesión que invalidar del lado suyo)
        localStorage.removeItem('accessToken');
        router.navigate(['/']);
      }
      // Siempre relanza el error, para que el .subscribe({ error: ... })
      // de cada componente (login, register, etc.) también se entere
      return throwError(() => err);
    })
  );
};