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
  private categoryService = inject(CategoryService); // inyectamos el servicio usando inject() (Angular 16+)
  private router = inject(Router); // inyectamos el router de Angular para redirigir
  private authService = inject(AuthService); // inyectamos el servicio de autenticacion

  /** Señal derivada: true si el usuario es admin */
  isAdmin = this.authService.isAdmin;

  categories = signal<Category[]>([]); // signal que almacena la lista completa de categorias
  isLoading = signal(false); // signal para controlar si estamos cargando datos o no
  errorMessage = signal(''); // signal para almacenar y mostrar mensajes de error

  // Variables de control para los formularios
  showForm = signal(false); // controla si el formulario modal se muestra o no
  isEditing = signal(false); // indica si el formulario actual es de edicion (true) o de creacion (false)
  currentCategoryId = signal<string | null>(null); // guarda el id de la categoria que estamos editando en el momento

  // Variables enlazadas con los inputs del formulario usando two-way binding (ngModel)
  name = signal(''); // nombre de la categoria en el formulario
  description = signal(''); // descripcion de la categoria en el formulario

  /** Se ejecuta automaticamente cuando Angular inicializa el componente */
  ngOnInit(): void {
    this.loadCategories();
  }

  /** Carga todas las categorias haciendo la peticion GET */
  loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data); // guardamos los datos de las categorias en nuestro signal
        this.isLoading.set(false); // apagamos la animacion de carga
      },
      error: (err) => {
        this.handleError(err); // controlamos el error si falla la llamada
        this.isLoading.set(false);
      },
    });
  }

  /** Abre el formulario limpio en modo "Creacion" */
  openCreateForm() {
    this.isEditing.set(false);
    this.currentCategoryId.set(null);
    this.name.set('');
    this.description.set('');
    this.errorMessage.set(''); // limpiamos errores previos
    this.showForm.set(true); // mostramos el formulario
  }

  /** Abre el formulario con los datos cargados en modo "Edicion" */
  openEditForm(category: Category, event: Event) {
    event.stopPropagation(); // evita que el click ejecute tambien goToProducts() al clickear la tarjeta
    this.isEditing.set(true);
    this.currentCategoryId.set(category.id);
    this.name.set(category.name);
    this.description.set(category.description || '');
    this.errorMessage.set(''); // limpiamos errores previos
    this.showForm.set(true); // mostramos el formulario
  }

  /** Cierra el formulario restableciendo su estado */
  closeForm() {
    this.showForm.set(false);
  }

  /** Se llama al enviar el formulario (Crear o Editar) */
  onSubmit() {
    const payload = {
      name: this.name(),
      description: this.description() || null,
    };

    if (this.isEditing()) {
      // EDITAR CATEGORIA (PATCH)
      this.categoryService.update(this.currentCategoryId()!, payload).subscribe({
        next: () => {
          this.loadCategories(); // recarga la lista para ver los cambios
          this.closeForm(); // cierra el formulario
        },
        error: (err) => this.handleError(err), // maneja errores (ej. nombre duplicado 409)
      });
    } else {
      // CREAR CATEGORIA (POST)
      this.categoryService.create(payload).subscribe({
        next: () => {
          this.loadCategories(); // recarga la lista con la nueva categoria
          this.closeForm(); // cierra el formulario
        },
        error: (err) => this.handleError(err), // maneja errores (ej. nombre duplicado 409 o vacio 400)
      });
    }
  }

  /** Elimina una categoria especifica previa confirmacion visual (Día 3 C) */
  onDelete(id: string, event: Event) {
    event.stopPropagation(); // evita que el click ejecute tambien goToProducts() al clickear el boton de borrar
    
    // confirm() es una alerta nativa del navegador que devuelve true si el usuario da click en aceptar
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.loadCategories(); // recargamos la lista una vez borrada
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  /** Maneja las respuestas de error HTTP (400, 404, 409) y las expone visualmente (Día 3 C) */
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

  /** Redirige al home filtrando por esta categoria */
  goToProducts(categoryId: string): void {
    this.router.navigate(['/'], { queryParams: { categoryId } });
  }
}
