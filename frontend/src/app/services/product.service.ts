import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { PaginatedProducts } from '../models/paginated-products.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * GET /products
   * La API responde paginado: { data, total, page, limit, totalPages }.
   * Los productos están en la propiedad "data", no en la raíz.
   */
  getAll(search?: string) {
    let params = new HttpParams().set('limit', '50');

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PaginatedProducts>(`${this.apiUrl}/products`, { params });
  }

  /** GET /products/:id — devuelve un producto individual. */
  getById(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}
