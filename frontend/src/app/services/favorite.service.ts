// services/favorite.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

/**
 * Los tres endpoints de /favorites requieren JWT, por eso cada
 * petición manda el token del AuthService en el header Authorization.
 */
@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  /** GET /favorites — productos favoritos del usuario logueado. */
  getAll() {
    return this.http.get<Product[]>(`${this.apiUrl}/favorites`, {
      headers: this.authHeaders(),
    });
  }

  /** POST /favorites/:productId — agrega un producto a favoritos. */
  add(productId: string) {
    return this.http.post(`${this.apiUrl}/favorites/${productId}`, null, {
      headers: this.authHeaders(),
    });
  }

  /** DELETE /favorites/:productId — quita un producto de favoritos. */
  remove(productId: string) {
    return this.http.delete(`${this.apiUrl}/favorites/${productId}`, {
      headers: this.authHeaders(),
    });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }
}
