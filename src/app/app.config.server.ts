// app.config.server.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes'; // hoặc appRoutes
import { provideClientHydration } from '@angular/platform-browser';

export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideClientHydration(),
    provideHttpClient(withFetch()), // 👈 tránh cảnh báo fetch
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
};
