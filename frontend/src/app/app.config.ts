import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      // El orden importa: authInterceptor agrega el header PRIMERO,
      // luego la petición sale; si la respuesta viene con error,
      // errorInterceptor la intercepta de vuelta.
      withInterceptors([authInterceptor, errorInterceptor])
    ),
  ],
};