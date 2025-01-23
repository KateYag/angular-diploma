import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {TermsComponent} from "./shared/components/terms/terms.component";
import {BlogComponent} from "./views/article/blog/blog.component";
import {DetailComponent} from "./views/article/detail/detail.component";



const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: '', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)},
      {path: '', loadChildren: () => import('./views/article/article.module').then(m => m.ArticleModule)},
      {path: 'articles/:url', component: DetailComponent},
      {path: 'terms', component: TermsComponent },
      {path: 'blog', component: BlogComponent },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
