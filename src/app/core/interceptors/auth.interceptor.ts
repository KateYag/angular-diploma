import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, finalize, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../auth/auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = this.authService.getTokens().accessToken;
    let clonedRequest = req;

    if (accessToken) {

      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });

    }

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refresh().pipe(
            switchMap((response) => {
              if ((response as LoginResponseType).accessToken) {
                const newTokens = response as LoginResponseType;
                this.authService.setTokens(newTokens.accessToken, newTokens.refreshToken);


                const newClonedRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newTokens.accessToken}`
                  }
                });
                return next.handle(newClonedRequest);
              }

                return throwError(() => new Error('Не удалось обновить токены'));

            })
          );
        }

        return throwError(() => error);
      })
    );
  }


}
