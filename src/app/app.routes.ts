import { Routes } from '@angular/router';
import { ArticleComponent } from './components/article/article.component.js';
import { CategoryComponent } from './components/category/category.component.js';
import { NewspaperComponent } from './components/newspaper/newspaper.component.js';
import { HomeComponent } from './home/home.component.js';

export const routes: Routes = [
  { path: 'category', component: CategoryComponent },
  { path: 'newspaper', component: NewspaperComponent },
  { path: 'article', component: ArticleComponent },
  { path: '', component: HomeComponent }, // Default route
];
