import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

import { StoreSdk } from '@store-sdk/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAppInitializer(() => {
      StoreSdk.init({
        baseUrl: 'http://localhost:3000',
        apiKey:
          'JSMZCLCHPMWOSELEBZARCJWWQNJFQMDSOPYCFMEXFVGYAJSXTTKGBSKQYCWWYZIF',
      });
    }),
  ],
};
