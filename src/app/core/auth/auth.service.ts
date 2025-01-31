import { Injectable } from '@angular/core';
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }




  login(email: string, password: string, rememberMe: boolean) : Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    })
  }
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    })
  }
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      }).pipe(
        tap(() => {
          this.removeTokens();
        })
      )
    }
    throw throwError(() => 'Can not find token');
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(() => 'CAn not use token');
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return  {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    }
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey)
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id)
    } else {
      localStorage.removeItem(this.userIdKey)
    }
  }

  // getUserInfo(): Observable<UserInfoType> {
  //   return this.http.get<UserInfoType>(environment.api + 'users')
  //     .pipe(tap(user => console.log('Полученные данные пользователя:', user)));
  // }
  getUserInfo(): Observable<UserInfoType> {
    const tokens = this.getTokens();


    if (tokens && tokens.accessToken) {
      console.log('Access Token:', tokens.accessToken);
      return this.http.get<UserInfoType>(environment.api + 'users', {
        headers: {
          'x-auth': tokens.accessToken // Передаем accessToken в заголовке
        }
      }).pipe(
        tap(user => console.log('Полученные данные пользователя:', user)),
        catchError((error) => {
          console.error('Ошибка при получении данных пользователя', error);
          return throwError(() => new Error('Ошибка при получении данных пользователя'));
        })
      );
    }
    return throwError(() => new Error('Не найден accessToken'));
  }

}
