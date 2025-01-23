import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {map, Observable} from "rxjs";
import {ArticleBlogType} from "../../../types/article-blog.type";
import {CommentType} from "../../../types/comment.type";
import {CommentResponseType} from "../../../types/comment-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get< ArticleType[]>(environment.api + 'articles/top');
  }
  getArticles(): Observable<{ count: number, pages: number, items: ArticleType[] }> {
    return this.http.get<{ count: number, pages: number, items: ArticleType[] }>(environment.api + 'articles')
      // .pipe(
      //   map(response => ({
      //     count: response.count,
      //     pages: response.pages,
      //     items: response.items
      //   }))
      // );
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }
  // getArticlesWithCategory(): Observable<ArticleType[]> {
  //   return this.http.get<{ count: number, pages: number, items: ArticleType[] }>(environment.api + 'articles')
  //     .pipe(
  //       map((items: { count: number, pages: number, items: ArticleType[]}) => {
  //
  //       })
  //     );
  // }

  getArticle(url: string): Observable<ArticleBlogType> {
    return this.http.get<ArticleBlogType>(environment.api + 'articles/' + url);
  }

  getComments(articleId: string,  offset: number): Observable<CommentResponseType> {
    return this.http.get<CommentResponseType>(environment.api + 'comments?offset=' + offset + '&article=' + articleId)
  }
}
