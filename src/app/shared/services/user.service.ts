import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {UserInfoType} from "../../../types/user-info.type";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    const accessToken = this.authService.getTokens().accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users', {headers})
      .pipe(
        tap(response => {
          console.log('Received user data:', response);
        }),
        catchError((error) => {
          console.error('Error fetching user data', error);

          return throwError(() => new Error('Ошибка получения данных пользователя.'));

        })
      );
  }
}
