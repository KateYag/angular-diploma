import {Component, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {filter} from "rxjs";
import {ArticleService} from "../../../shared/services/article.service";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  filteredArticles: ArticleType[] = [];
  categories: CategoryType[] = [];
  open = false;
  activeCategories: string[] = [];
  activeParams: any;
  appliedFilters: {
    name: string,
    urlParam: string
  }[] = [];


  constructor(private articleService: ArticleService,
              private route: ActivatedRoute,
              private http: HttpClient,

              private router: Router) {
  }

  ngOnInit(): void {

    // this.route.queryParams.subscribe(params => {
    //   this.activeParams = params;
    //   console.log(this.activeParams);
    //   if (this.activeParams.category && Array.isArray(this.activeParams.category)) {
    //     // Проходим по каждому параметру категории из activeParams
    //     this.activeParams.category.forEach((url: string) => {
    //       // Ищем соответствие в categories
    //       const matchingCategory = this.categories.find(category => category.url === url);
    //       if (matchingCategory && !this.appliedFilters.some(filter => filter.name === matchingCategory.name)) {
    //         // Добавляем найденную категорию в appliedFilters
    //         this.appliedFilters.push({
    //           name: matchingCategory.name,
    //           urlParam: url
    //         });
    //       }
    //     });
    //   }
    // });

    this.route.queryParams.subscribe(params => {
      this.activeParams = params;
      this.activeCategories = Array.isArray(params['category']) ? params['category'] : (params['category'] ? [params['category']] : []);
      // Применяем фильтры после загрузки параметров
      this.applyFilters();
    });

    this.articleService.getArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
        this.applyFilters();

      });
    this.http.get<CategoryType[]>('http://localhost:3000/api/categories')
      .subscribe(data => {
        this.categories = data;
        this.applyFilters();
      });

  }
  // Метод фильтрации статей
  applyFilters(): void {
    if (this.activeCategories.length === 0) {
        this.filteredArticles = this.articles;

      return;
    }
    this.filteredArticles = this.articles.filter(article => {
        const articleCategory = this.categories.find(category => category.name === article.category);
        return articleCategory && this.activeCategories.includes(articleCategory.url);
    }
      //this.activeCategories.includes(article.category)
    );
    console.log('Filtered Articles:', this.filteredArticles);
    // const queryParams = new URLSearchParams();
    // this.activeCategories.forEach(category => {
    //   queryParams.append('categories[]', category);
    // });
    //
    // const apiUrl = `http://localhost:3000/api/articles?${queryParams.toString()}`;
    // console.log('API URL:', apiUrl);
    // this.http.get<ArticleType[]>(apiUrl).subscribe((data: ArticleType[]) => {
    //
    //   this.filteredArticles = data; // Присваиваем отфильтрованные статьи
    //
    // });
  }

  toggle(): void {
    this.open = !this.open;
  }

  isActiveCategory(categoryUrl: string): boolean {
    return this.activeCategories.includes(categoryUrl);
  }


  choose(categoryUrl: string): void {
    const category = this.categories.find(c => c.url === categoryUrl);
    if (category) {
      this.toggleCategory(category);
      this.applyFilters();
    }
  }

  updateUrl(): void {
    const queryParams: { [key: string]: string | string[] } = {};

    if (this.activeCategories.length) {
      this.activeCategories.forEach(category => {
        if (!queryParams['category']) {
          queryParams['category'] = category;
        } else {

          if (Array.isArray(queryParams['category'])) {
            queryParams['category'].push(category);
          } else {
            queryParams['category'] = [queryParams['category'], category];
          }
        }
      });
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      //queryParamsHandling: 'merge'
    });
  }

  toggleCategory(category: CategoryType): void {
    const isAlreadyActive = this.activeCategories.includes(category.url);

    if (isAlreadyActive) {
      // Удаляем категорию из активных
      this.activeCategories = this.activeCategories.filter(c => c !== category.url);

      // Удаляем из списка appliedFilters
      this.appliedFilters = this.appliedFilters.filter(filter => filter.urlParam !== category.url);
    } else {
      // Добавляем категорию в активные
      this.activeCategories.push(category.url);

      // Добавляем в список appliedFilters
      this.appliedFilters.push({
        name: category.name,
        urlParam: category.url
      });
    }

    // Обновляем параметры URL
    this.updateUrl();
    this.applyFilters();
  }
  removeAppliedFilter(appliedFilter:{ name: string, urlParam: string }): void {

    const category = this.categories.find(c => c.url === appliedFilter.urlParam);
    if (category) {
      this.toggleCategory(category);
      this.applyFilters();
    }
  }


}
