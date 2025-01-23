import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });
  private subscription: Subscription | null = null;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
  }
   login(): void {
     if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
       this.subscription = this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
         .subscribe({
           next: (data: LoginResponseType | DefaultResponseType) => {
             let error: string | null = null;
             if ((data as DefaultResponseType).error !== undefined) {
               error = (data as DefaultResponseType).message;
             }
             const loginResponse = data as LoginResponseType
             if (!(loginResponse).accessToken || !(loginResponse).refreshToken || !(loginResponse).userId) {
               error = 'Ошибка авторизации';
             }
             if (error) {
               this._snackBar.open(error);
               throw new Error(error)
             }
  //
             this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
             this.authService.userId = loginResponse.userId;
             this._snackBar.open('Вы успешно авторизовались');


             this.authService.getUserInfo().subscribe({
               next: (user) => {
                 console.log('Данные пользователя:', user);
                 this.router.navigate(['/']);
               },
               error: (err: HttpErrorResponse) => {
                 this._snackBar.open('Ошибка загрузки данных пользователя');
               }
             });




             this.router.navigate(['/']);
           },
           error: (errorResponse: HttpErrorResponse) => {
             if (errorResponse.error && errorResponse.error.message) {
               this._snackBar.open(errorResponse.error.message);
             } else {
               this._snackBar.open('Ошибка авторизации');
             }
           }
         });
     }
   }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
