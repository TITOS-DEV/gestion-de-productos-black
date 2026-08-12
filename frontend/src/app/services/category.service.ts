import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /** GET /categories — lista pública, usada para armar el filtro del home. */
  getAll() {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
