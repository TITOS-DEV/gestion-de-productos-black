import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { Loading } from '../../components/ui/loading/loading';

@Component({
  selector: 'app-categories',
  imports: [Loading],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  /** Se ejecuta una vez cuando Angular termina de crear el componente. */
  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar las categorías. Intenta de nuevo.');
        this.isLoading.set(false);
      },
    });
  }

  /** Lleva al home ya filtrado por esta categoría (mismo filtro que usan los botones del home). */
  goToProducts(categoryId: string): void {
    this.router.navigate(['/'], { queryParams: { categoryId } });
  }
}
