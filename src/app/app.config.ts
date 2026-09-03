import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './features/auth/services/auth.interceptor';

// PrimeNG is installed but intentionally not initialized yet.
// Enabling providePrimeNG requires a valid PrimeUI license key.
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import Aura from '@primeuix/themes/aura';
// import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    // provideAnimationsAsync(),
    // providePrimeNG({
    //   license: 'YOUR_PRIMEUI_LICENSE_KEY',
    //   theme: {
    //     preset: Aura,
    //     options: {
    //       darkModeSelector: false,
    //     },
    //   },
    // }),
    provideRouter(routes),
  ],
};
