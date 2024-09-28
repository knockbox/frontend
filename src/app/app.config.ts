import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {JwtModule} from "@auth0/angular-jwt";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem("access_token");
          },
          allowedDomains: [
            new RegExp(`.*localhost.*`)
          ]
        }
      })
    ),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes)
  ]
};
