import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {forkJoin, Subject} from "rxjs";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {


  @Input() article!: ArticleType;

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute) {
  }

  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    // this.activatedRoute.params.subscribe(params => {
    //   this.articleService.getArticle(params['url'])
    //     .subscribe((data: ArticleType) => {
    //       this.article = data;
    //
    //
    //     });
    // });


  }

}
