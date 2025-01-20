import { Component, OnInit } from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleBlogType} from "../../../../types/article-blog.type";
import {ArticleType} from "../../../../types/article.type";
import {forkJoin} from "rxjs";
import {CommentType} from "../../../../types/comment.type";
import {CommentResponseType} from "../../../../types/comment-response.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  article!: ArticleBlogType;
  relatedArticles: ArticleType[] = [];
  comments: CommentType[] = [];
  displayedComments: CommentType[] = [];
  loadingMoreComments = false;
  hasMoreComments = false;
  private offset = 0; // Смещение для подгрузки комментариев
  private readonly limit = 10; // Количество комментариев на запрос

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const articleId = params['url'];
      forkJoin([
        this.articleService.getArticle(params['url']),
        this.articleService.getRelatedArticles(params['url'])
      ]).subscribe(([article, relatedArticles]) => {
        this.article = article;
        this.relatedArticles = relatedArticles;

        //this.loadComments(articleId);
      });
    });


  }

  // loadComments(articleId: string): void {
  //   this.articleService.getComments(articleId, this.offset).subscribe(
  //     (response: CommentResponseType) => {
  //       const newComments = response.comments;
  //       this.comments = newComments;
  //       this.displayedComments = newComments.slice(0, this.offset + this.limit);
  //
  //       this.hasMoreComments = this.comments.length > this.displayedComments.length;
  //     },
  //     (error) => {
  //       console.error('Error loading comments:', error);
  //     }
  //   );
  // }
  //
  //
  // loadMoreComments(): void {
  //   if (this.loadingMoreComments) return; // Если уже идет загрузка, не выполняем запрос повторно
  //
  //   this.loadingMoreComments = true;
  //   this.offset += this.limit; // Обновляем смещение
  //
  //   this.articleService.getComments(this.article.id, this.offset).subscribe(
  //     (response: CommentResponseType) => {
  //       const newComments = response.comments;
  //       this.displayedComments = [...this.displayedComments, ...newComments];
  //
  //       this.hasMoreComments = newComments.length > 0;
  //       this.loadingMoreComments = false;
  //     },
  //     (error) => {
  //       console.error('Error loading more comments:', error);
  //       this.loadingMoreComments = false;
  //     }
  //   );
  // }





}
