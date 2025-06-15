// app.config.server.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes'; // hoặc appRoutes

export const config: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()), // 👈 tránh cảnh báo fetch
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
};
