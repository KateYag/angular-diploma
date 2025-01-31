import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { MainComponent } from './views/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatMenu, MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {CarouselModule} from "ngx-owl-carousel-o";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthInterceptor} from "./core/interceptors/auth.interceptor";
import {SharedModule} from "./shared/shared.module";
import {ArticleModule} from "./views/article/article.module";
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ArticleModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    CarouselModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor,  multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
