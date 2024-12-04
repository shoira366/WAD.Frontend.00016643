import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Newspaper } from '../models/newspaper.js';

@Injectable({
  providedIn: 'root',
})
export class NewspaperService {
  private apiUrl = 'https://localhost:7281/api/Newspaper/'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  // Method to create a new newspaper
  createNewspaper(name: string, description: string): Observable<Newspaper> {
    const payload = { newspaperName: name, newspaperDescription: description };
    return this.http.post<Newspaper>(this.apiUrl, payload);
  }

  // Method to get newspaper by id
  getById(id: number): Observable<Newspaper> {
    return this.http.get<Newspaper>(this.apiUrl + id);
  }

  // Method to get all newspapers
  getAll(): Observable<Newspaper[]> {
    return this.http.get<Newspaper[]>(this.apiUrl);
  }

  // Method to edit newspaper
  updateNewspaper(id: number, name: string, description: string) {
    const payload = {
      newspaperId: id,
      newspaperName: name,
      newspaperDescription: description,
    };
    return this.http.put(this.apiUrl + id, payload);
  }

  // Method to delete newspaper
  deleteNewspaper(id: number) {
    return this.http.delete(this.apiUrl + id);
  }
}
