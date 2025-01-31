import { Component, OnInit } from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleBlogType} from "../../../../types/article-blog.type";
import {ArticleType} from "../../../../types/article.type";
import {forkJoin} from "rxjs";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CommentService} from "../../../shared/services/comment.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  article!: ArticleBlogType;
  relatedArticles: ArticleType[] = [];
  comments: CommentType[] = [];
  articleId: string = '';
  offset: number = 0;
  isLoading: boolean = false;
  allLoaded: boolean = false;
  allCount: number = 0;
  isLoggedIn: boolean = false;
  commentText: string = '';
  isLiked = false;
  commentId: string = '';
  isDisliked = false;
  hasReported = false;


  constructor(private articleService: ArticleService,
              private authService: AuthService,
              private http: HttpClient,
              private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {

    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.activatedRoute.params.subscribe(params => {

      forkJoin([
        this.articleService.getArticle(params['url']),
        this.articleService.getRelatedArticles(params['url'])
      ]).subscribe(([article, relatedArticles]) => {
        this.article = article;
        this.relatedArticles = relatedArticles;
        this.articleId = article.id;
        this.loadComments(this.articleId);
        //this.loadUserReactions(this.commentId);
      });
    });


  }

  loadComments(articleId: string): void {
    this.isLoading = true;
    this.commentService.getComments(articleId, this.offset).subscribe({
      next: (data) => {
        if (this.offset === 0) {
          this.comments = data.comments;
        } else {
          this.comments = [...this.comments, ...data.comments];
        }

        this.allCount = data.allCount;
        this.isLoading = false;
        this.loadUserReactions();
      },
      error: (err) => {
        console.error('Ошибка загрузки комментариев', err);
        this._snackBar.open('Ошибка загрузки комментариев! Попробуйте снова.');
        this.isLoading = false;
      }
    });
  }

  loadMoreComments(): void {
    if (!this.isLoading && this.allCount > this.comments.length) {
      this.offset += 10;
      this.loadComments(this.articleId);
    }
  }


  addComment(): void {
    if (!this.commentText.trim()) {
      return;
    }
    this.commentService.addComment(this.articleId, this.commentText).subscribe({
      next: (data) => {
        this.commentText = '';
        this.loadComments(this.articleId);
      },
      error: (err) => {
        console.error('Ошибка добавления комментария', err);
        this._snackBar.open('Ошибка добавления комментария! Попробуйте снова.');

      }
    });
  }


  applyAction(action: 'like' | 'dislike' , commentId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;
    this.commentService.applyAction(commentId, action).subscribe({
      next: (response) => {
        if (action === 'like') {

          if (comment.isLiked) {
            comment.likesCount--;
            comment.isLiked = false;
          } else {
            comment.likesCount++;
            if (comment.isDisliked) {
              comment.dislikesCount--;
              comment.isDisliked = false;
            }
            comment.isLiked = true;
           }
          // this._snackBar.open('Ваш голос учтен!');

        } else if (action === 'dislike') {

          if (comment.isDisliked) {
            comment.dislikesCount--;
            comment.isDisliked = false;
          } else {
            comment.dislikesCount++;
            if (comment.isLiked) {
              comment.likesCount--;
              comment.isLiked = false;
            }
            comment.isDisliked = true;

          }
        }
        this._snackBar.open('Ваш голос учтен!');

      },
      error: (err) => {
        console.error('Ошибка выполнения действия:', err);
        this._snackBar.open('Ошибка! Попробуйте снова.');
      },
    });
  }


  reportComment(commentId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.hasReported) {
      this._snackBar.open('Жалоба уже отправлена!');
      return;
    }

    this.commentService.reportComment(commentId).subscribe({
      next: () => {
        comment.hasReported = true;
        this._snackBar.open('Жалоба отправлена!');
      },
      error: (err) => {
        console.error('Ошибка отправки жалобы:', err);
        //this._snackBar.open('Ошибка! Попробуйте снова.');
        this._snackBar.open('Жалоба уже отправлена!');
      },
    });
  }



  loadUserReactions(): void {
    this.commentService.getUserReactions(this.articleId).subscribe({
      next: (reactions) => {
        this.comments.forEach(comment => {
          const reaction = reactions.find(r => r.commentId === comment.id);
          if (reaction) {
            comment.isLiked = reaction.reaction === 'like';
            comment.isDisliked = reaction.reaction === 'dislike';
          }
        });
      },
      error: (err) => {
        console.error('Ошибка получения реакций пользователя:', err);
      },
    });
  }










}
