import {Component, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {filter, Subscription} from "rxjs";
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

  pages: number[] = [];

  private queryParamsSubscription: Subscription | null = null;
  private articlesSubscription: Subscription | null = null;
  private categoriesSubscription: Subscription | null = null;


  constructor(private articleService: ArticleService,
              private route: ActivatedRoute,
              private http: HttpClient,

              private router: Router) {
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.activeParams = params;
      this.activeCategories = Array.isArray(params['category']) ? params['category'] : (params['category'] ? [params['category']] : []);

      this.loadFiltersFromLocalStorage();
      this.applyFilters();
    });

    this.articleService.getArticles()
      .subscribe(data => {
        this.articles = data.items;
        this.applyFilters();
        this.pages = [];
        for (let i = 1; i < data.pages; i++) {
          this.pages.push(i);
        }

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
    );

  }

  toggle(): void {
    this.open = !this.open;
  }

  loadFiltersFromLocalStorage(): void {
    const storedFilters = localStorage.getItem('appliedFilters');
    if (storedFilters) {
      this.appliedFilters = JSON.parse(storedFilters);
      this.activeCategories = this.appliedFilters.map(filter => filter.urlParam);
    }
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
    this.saveFiltersToLocalStorage();

    this.loadFiltersFromLocalStorage();
    this.updateUrl();
    this.applyFilters();
  }
  removeAppliedFilter(appliedFilter:{ name: string, urlParam: string }): void {

    const category = this.categories.find(c => c.url === appliedFilter.urlParam);
    if (category) {

      this.toggleCategory(category);
      this.applyFilters();
    }
    this.loadFiltersFromLocalStorage();
    this.saveFiltersToLocalStorage();
  }
  saveFiltersToLocalStorage(): void {
    localStorage.setItem('appliedFilters', JSON.stringify(this.appliedFilters));
  }
  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage(){
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }

  }
  openNextPage(){
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.articlesSubscription) {
      this.articlesSubscription.unsubscribe();
    }
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
    localStorage.removeItem('appliedFilters');
  }

}
