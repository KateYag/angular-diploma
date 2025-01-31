import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import {ArticleCardComponent} from "./article-card/article-card.component";
import { DetailComponent } from './detail/detail.component';
import {BlogComponent} from "./blog/blog.component";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    ArticleCardComponent,
    BlogComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ArticleRoutingModule,
    HttpClientModule


  ],
  exports: [
    ArticleCardComponent
  ]
})
export class ArticleModule { }
