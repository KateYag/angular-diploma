import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {UserService} from "../../services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  name: string | null = null;
  private subscriptions: Subscription = new Subscription();
  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    const authSub = this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;

      // if (this.isLogged) {
      //   const userSub = this.userService.getUserInfo().subscribe({
      //     next: (response: UserInfoType | DefaultResponseType) => {
      //       if ('name' in response) {
      //         this.name = response.name;
      //         console.log('User Name:', this.name);
      //       } else {
      //         this.name = null;
      //         console.log('Invalid response:', response);
      //       }
      //     },
      //     error: (error) => {
      //       this.name = null;
      //       console.error('Error while fetching user info:', error);          }
      //   });
      //   this.subscriptions.add(userSub);
      // } else {
      //   this.name = null;
      // }
    });
    //this.subscriptions.add(authSub);
  }


  logout(): void {
    const logoutSub = this.authService.logout()
      .subscribe({
        next: () => {
          this.doLoggout();
        },
        error: () => {
          this.doLoggout();
        }
      });
    this.subscriptions.add(logoutSub);
  }

  doLoggout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
