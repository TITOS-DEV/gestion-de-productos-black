import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
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

  product = signal<Product | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  /** Se ejecuta una vez cuando Angular termina de crear el componente. */
  ngOnInit(): void {
    // El id llega como parámetro de ruta: /products/:id
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el producto. Intenta de nuevo.');
        this.isLoading.set(false);
      },
    });
  }
}
