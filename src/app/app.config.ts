import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { AuthInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
  ],
};
