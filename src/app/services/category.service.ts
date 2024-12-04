import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category.js';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'https://localhost:7281/api/Category/';

  constructor(private http: HttpClient) {}

  // Method to create a new category
  createCategory(categoryName: string): Observable<Category> {
    const payload = { name: categoryName };
    return this.http.post<Category>(this.apiUrl, payload);
  }

  // Method to get category by id
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(this.apiUrl + id);
  }

  // Method to get all categories
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Method to edit category
  updateCategory(id: number, name: string) {
    const payload = { categoryId: id, categoryName: name };
    return this.http.put(this.apiUrl + id, payload);
  }

  // Method to delete category
  deleteCategory(id: number) {
    return this.http.delete(this.apiUrl + id);
  }
}
