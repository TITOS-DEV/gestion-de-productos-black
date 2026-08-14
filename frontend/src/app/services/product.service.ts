import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { PaginatedProducts } from '../models/paginated-products.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // GET
  getAll(search?: string, categoryId?: string) {
    let params = new HttpParams().set('limit', '50');

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }

    return this.http.get<PaginatedProducts>(`${this.apiUrl}/products`, { params });
  }


  getById(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }


  create(productData: any) {
    return this.http.post<Product>(`${this.apiUrl}/products`, productData);
  }


  update(id: string, productData: any) {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, productData);
  }


  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}

