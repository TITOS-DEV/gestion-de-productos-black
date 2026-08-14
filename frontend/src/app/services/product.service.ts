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

  /** GET /products/:id — devuelve un producto individual. */
  getById(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  /** POST /products — enviamos los datos para crear un nuevo producto */
  create(productData: any) {
    return this.http.post<Product>(`${this.apiUrl}/products`, productData);
  }

  /** PATCH /products/:id — actualizamos los datos de un producto especifico usando su id */
  update(id: string, productData: any) {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, productData);
  }

  /** DELETE /products/:id — eliminamos un producto del backend usando su id */
  delete(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}

