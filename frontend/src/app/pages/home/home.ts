import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../components/ui/product-card/product-card';
import { Loading } from '../../components/ui/loading/loading';

@Component({
  selector: 'app-home',
  imports: [ProductCard, Loading],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  /** Se ejecuta una vez cuando Angular termina de crear el componente. */
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(search?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getAll(search).subscribe({
      next: (response) => {
        // La API responde paginado: los productos están en "data".
        this.products.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los productos. Intenta de nuevo.');
        this.isLoading.set(false);
      },
    });
  }
}