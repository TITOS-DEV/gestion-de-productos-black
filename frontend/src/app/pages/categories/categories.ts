import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // nos da el modulo necesario para usar [(ngModel)] y conectar inputs con variables
import { CategoryService } from '../../services/category.service'; // inyectamos el servicio que maneja las llamadas a la API
import { Category } from '../../models/category.model'; // importamos el modelo/interfaz de categoria
import { Loading } from '../../components/ui/loading/loading'; // importamos el componente de pantalla de carga
import { AuthService } from '../../services/auth.service'; // inyectamos el servicio de autenticacion para verificar el rol

@Component({
  selector: 'app-categories',
  imports: [Loading, FormsModule], // agregamos FormsModule aca para que los formularios de creacion/edicion funcionen
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private authService = inject(AuthService);

  isAdmin = this.authService.isAdmin;

  categories = signal<Category[]>([]); //almacena la lista categorias
  isLoading = signal(false);
  errorMessage = signal('');


  showForm = signal(false); // mostrar modal
  isEditing = signal(false); // si es formulario de edicion o de creacin
  currentCategoryId = signal<string | null>(null); // id


  name = signal('');
  description = signal('');


  ngOnInit(): void {
    this.loadCategories();
  }

  // Carga las categorias haciendo  get 
  loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        this.handleError(err);
        this.isLoading.set(false);
      },
    });
  }

  openCreateForm() {
    this.isEditing.set(false);
    this.currentCategoryId.set(null);
    this.name.set('');
    this.description.set('');
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  openEditForm(category: Category, event: Event) {
    event.stopPropagation();
    this.isEditing.set(true);
    this.currentCategoryId.set(category.id);
    this.name.set(category.name);
    this.description.set(category.description || '');
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onSubmit() {
    const payload = {
      name: this.name(),
      description: this.description() || null,
    };

    if (this.isEditing()) {
      this.categoryService.update(this.currentCategoryId()!, payload).subscribe({
        next: () => {
          this.loadCategories();
          this.closeForm();
        },
        error: (err) => this.handleError(err),
      });
    } else {
      this.categoryService.create(payload).subscribe({
        next: () => {
          this.loadCategories();
          this.closeForm();
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  onDelete(id: string, event: Event) {
    event.stopPropagation();

    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  private handleError(err: any) {
    const status = err.status;
    const errorBody = err.error;

    if (status === 409) {
      this.errorMessage.set('El nombre de la categoría ya existe en el sistema (Error 409).');
    } else if (status === 400) {
      const msg = errorBody?.message;
      this.errorMessage.set(
        Array.isArray(msg)
          ? `Error de validación (400): ${msg.join(', ')}`
          : `Error de validación (400): ${msg || 'Campos requeridos vacíos'}`
      );
    } else if (status === 404) {
      this.errorMessage.set('La categoría solicitada no se encontró en el sistema (Error 404).');
    } else {
      this.errorMessage.set('Ocurrió un error inesperado al procesar la solicitud.');
    }
  }

  goToProducts(categoryId: string): void {
    this.router.navigate(['/'], { queryParams: { categoryId } });
  }
}
