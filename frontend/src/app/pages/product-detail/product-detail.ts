import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Loading } from '../../components/ui/loading/loading';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, Loading],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  product = signal<Product | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  isFavorite = signal(false);
  favoriteError = signal('');

  // La plantilla la usa para ocultar el botón de favoritos sin sesión iniciada.
  isLoggedIn = this.authService.isLoggedIn;

  /** Se ejecuta una vez cuando Angular termina de crear el componente. */
  ngOnInit(): void {
    // El id llega como parámetro de ruta: /products/:id
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  /**
   * Agrega o quita el producto de favoritos según su estado actual.
   * El botón solo se muestra con sesión iniciada, así que no hace
   * falta validar eso aquí (ver isLoggedIn en la plantilla).
   */
  toggleFavorite(): void {
    const item = this.product();
    if (!item) return;

    this.favoriteError.set('');
    const request = this.isFavorite()
      ? this.favoriteService.remove(item.id)
      : this.favoriteService.add(item.id);

    request.subscribe({
      next: () => this.isFavorite.set(!this.isFavorite()),
      error: () => this.favoriteError.set('No se pudo actualizar favoritos. Intenta de nuevo.'),
    });
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
        this.checkFavoriteStatus(id);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el producto. Intenta de nuevo.');
        this.isLoading.set(false);
      },
    });
  }

  /** Consulta si este producto ya está en los favoritos del usuario, para pintar el botón correcto. */
  private checkFavoriteStatus(productId: string): void {
    if (!this.authService.isLoggedIn()) return;

    this.favoriteService.getAll().subscribe({
      next: (favorites) => this.isFavorite.set(favorites.some((p) => p.id === productId)),
      error: () => {}, // si falla, el botón simplemente arranca en "no favorito"
    });
  }
}
