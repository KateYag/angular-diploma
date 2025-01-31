import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {CommentType} from "../../../types/comment.type";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../core/auth/auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {UserReactionType} from "../../../types/user-reaction.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor( private http: HttpClient,
               private authService: AuthService) { }

  getComments(articleId: string, offset: number = 0): Observable<{ comments: CommentType[]; allCount: number }> {
    const params = new HttpParams()
      .set('article', articleId)
      .set('offset', offset.toString());

    return this.http.get<any>(environment.api + 'comments', { params }).pipe(
      map((response) => ({
        comments: response.comments,
        allCount: response.allCount,
      }))
    );
  }

  addComment(articleId: string, text: string): Observable<any> {
    // Получаем токен из AuthService
    const token = this.authService.getTokens();
    const headers = new HttpHeaders().set('x-auth', token.accessToken!);

    const body = {
      text: text,
      article: articleId
    };

    return this.http.post<any>(environment.api + 'comments', body, { headers });
  }
  applyAction(commentId: string, action: 'like' | 'dislike' | 'violate'): Observable<DefaultResponseType> {

    const token = this.authService.getTokens();
    const headers = new HttpHeaders().set('x-auth', token.accessToken!);

    const body = {action};

    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', body, { headers });
  }


  getUserReactions(articleId: string): Observable<UserReactionType[]> {
    const token = this.authService.getTokens();
    const headers = new HttpHeaders().set('x-auth', token.accessToken!);

    return this.http.get<UserReactionType[]>(environment.api + 'comments/article-comment-actions', { headers, params: { articleId } });
  }
  reportComment(commentId: string): Observable<DefaultResponseType> {
    const token = this.authService.getTokens();
    const headers = new HttpHeaders().set('x-auth', token.accessToken!);
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', { action: 'violate' }, { headers });
  }



  // getUserReactions(): Observable<UserReactionType[]> {
  //   const token = this.authService.getTokens();
  //   const headers = new HttpHeaders().set('x-auth', token.accessToken!);
  //   return this.http.get<UserReactionType[]>(environment.api + '/comments/' + commentId + 'actions', { headers });
  // }

  // getReactions(commentId: string): Observable<string[]> {
  //   return this.http.get<string[]>(`/api/comments/${commentId}/reactions`);
  // }
  // toggleReaction(commentId: string, reaction: 'like' | 'dislike'): Observable<void> {
  //   return this.http.post<void>(`/api/comments/${commentId}/reactions`, { reaction });
  // }
  // removeReaction(commentId: string, reaction: 'like' | 'dislike'): Observable<void> {
  //   return this.http.delete<void>(`/api/comments/${commentId}/reactions/${reaction}`);
  // }
  // reportComment(commentId: string): Observable<void> {
  //   return this.http.post<void>(`/api/comments/${commentId}/report`, {});
  // }
}
