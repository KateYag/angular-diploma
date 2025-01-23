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

  // getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
  //   const tokens = this.authService.getTokens();
  //   const accessToken = tokens.accessToken;
  //
  //   if (!accessToken) {
  //     console.error('Access token is missing. User is not authenticated.');
  //     return throwError(() => new Error('Access token is missing'));
  //   }
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${accessToken}`
  //   });
  //   console.log('Headers:', headers);
  //
  //   return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users', { headers })
  //     .pipe(
  //     tap((response) => console.log('User info fetched:', response)),
  //     catchError((error) => {
  //       console.error('Error fetching user info:', error);
  //       return throwError(() => error);
  //     })
  //   );
  //
  // }
}
