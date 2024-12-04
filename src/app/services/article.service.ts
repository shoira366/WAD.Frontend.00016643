import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.js';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'https://localhost:7281/api/Article/';

  constructor(private http: HttpClient) {}

  // Method to create a new category
  createArticle(
    title: string,
    content: string,
    newspaperId: number,
    categoryId: number
  ): Observable<Article> {
    const payload = {
      title,
      content,
      newspaperId,
      categoryId,
    };
    return this.http.post<Article>(this.apiUrl, payload);
  }

  // Method to get category by id
  getById(id: number): Observable<Article> {
    return this.http.get<Article>(this.apiUrl + id);
  }

  // Method to get all categories
  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  // Method to edit category
  updateArticle(
    id: number,
    title: string,
    content: string,
    newspaperId: number,
    categoryId: number
  ) {
    const payload = {
      articleId: id,
      title,
      content,
      newspaperId,
      categoryId,
    };
    return this.http.put(this.apiUrl + id, payload);
  }

  // Method to delete category
  deleteArticle(id: number) {
    return this.http.delete(this.apiUrl + id);
  }
}
