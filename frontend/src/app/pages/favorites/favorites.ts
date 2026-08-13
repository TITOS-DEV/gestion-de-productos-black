import { Component, inject, signal, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../components/ui/product-card/product-card';
import { Loading } from '../../components/ui/loading/loading';

@Component({
  selector: 'app-favorites',
  imports: [ProductCard, Loading],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  products = signal<Product[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // La plantilla la usa para mostrar el aviso de "inicia sesión" en vez del listado.
  isLoggedIn = this.authService.isLoggedIn;

  /** Se ejecuta una vez cuando Angular termina de crear el componente. */
  ngOnInit(): void {
    if (!this.isLoggedIn()) return; // sin sesión, GET /favorites respondería 401

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.favoriteService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar tus favoritos. Intenta de nuevo.');
        this.isLoading.set(false);
      },
    });
  }
}
