import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component.js';
import { HomeComponent } from './home/home.component.js';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './components/category/category.component.js';
import { NewspaperComponent } from './components/newspaper/newspaper.component.js';
import { ArticleComponent } from './components/article/article.component.js';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomeComponent,
    HeaderComponent,
    CategoryComponent,
    NewspaperComponent,
    ArticleComponent,
    RouterModule,
    FormsModule,
  ],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      main {
        padding: 16px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'NewspaperApp';
}
