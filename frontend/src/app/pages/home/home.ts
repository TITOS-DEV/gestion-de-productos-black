import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
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
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // Filtros activos. Se leen de la URL para que la búsqueda del navbar
  // y el filtro de categoría puedan compartir el mismo estado.
  searchTerm = signal('');
  selectedCategoryId = signal('');

  // Mensaje de lista vacía: distingue "no hay nada" de "nada coincide con el filtro".
  emptyMessage = computed(() =>
    this.searchTerm() || this.selectedCategoryId()
      ? 'Ningún producto coincide con el filtro aplicado.'
      : 'No hay productos para mostrar.'
  );

  /** Se ejecuta una vez cuando Angular termina de crear el componente. */
  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories.set(categories),
      // El filtro es un extra: si falla, el listado de productos igual funciona.
      error: () => {},
    });

    // Reacciona a cambios en ?search= y ?categoryId= (navbar, clicks en
    // categorías, o recargar la página con la URL ya filtrada).
    this.route.queryParamMap.subscribe((params) => {
      const search = params.get('search') ?? '';
      const categoryId = params.get('categoryId') ?? '';

      this.searchTerm.set(search);
      this.selectedCategoryId.set(categoryId);
      this.loadProducts(search, categoryId);
    });
  }

  /** Cambia el filtro de categoría actualizando la URL, sin perder la búsqueda activa. */
  filterByCategory(categoryId: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { categoryId: categoryId || null },
      queryParamsHandling: 'merge',
    });
  }

  private loadProducts(search?: string, categoryId?: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.productService.getAll(search, categoryId).subscribe({
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
