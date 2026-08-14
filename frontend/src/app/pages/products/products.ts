import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // importamos modulo para poder enlazar formularios con variables ngModel
import { ProductService } from '../../services/product.service'; // inyectamos el servicio para peticiones HTTP de productos
import { CategoryService } from '../../services/category.service'; // inyectamos el servicio para obtener la lista de categorias en el select
import { Product } from '../../models/product.model'; // interfaz de producto
import { Category } from '../../models/category.model'; // interfaz de categoria
import { Loading } from '../../components/ui/loading/loading'; // componente spinner de carga

@Component({
  selector: 'app-products',
  imports: [Loading, FormsModule], // agregamos FormsModule y Loading para usarlos en el html
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private productService = inject(ProductService); // inyectamos el servicio de productos
  private categoryService = inject(CategoryService); // inyectamos el servicio de categorias

  products = signal<Product[]>([]); // signal para almacenar la lista de productos
  categories = signal<Category[]>([]); // signal para las categorias disponibles en el select
  isLoading = signal(false); // signal para mostrar spinner de carga
  errorMessage = signal(''); // signal para mensajes de error de la API

  // Variables de control del formulario
  showForm = signal(false); // controla si el formulario modal de productos esta visible
  isEditing = signal(false); // indica si estamos editando (true) o creando (false)
  editingProductId = signal<string | null>(null); // guarda el id del producto en edicion

  // Variables enlazadas con el formulario mediante two-way data binding ([(ngModel)])
  name = signal('');
  description = signal('');
  price = signal(0);
  stock = signal(0);
  categoryId = signal('');
  imageUrl = signal(''); // ingresamos una url de imagen del producto

  /** Se ejecuta al arrancar el componente */
  ngOnInit() {
    this.loadData();
  }

  /** Carga inicial de productos y categorias */
  loadData() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Cargamos categorias para el dropdown selector del formulario
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.errorMessage.set('Error al cargar la lista de categorías.')
    });

    // Cargamos la lista completa de productos
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products.set(res.data); // la API responde con la propiedad "data" donde estan los productos
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar la lista de productos.');
        this.isLoading.set(false);
      }
    });
  }

  /** Abre el formulario vacio para crear producto */
  openCreateForm() {
    this.isEditing.set(false);
    this.editingProductId.set(null);
    this.name.set('');
    this.description.set('');
    this.price.set(0);
    this.stock.set(0);
    this.categoryId.set('');
    this.imageUrl.set('');
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  /** Abre el formulario con los datos cargados para editar */
  openEditForm(product: Product) {
    this.isEditing.set(true);
    this.editingProductId.set(product.id);
    this.name.set(product.name);
    this.description.set(product.description || '');
    this.price.set(product.price);
    this.stock.set(product.stock);
    this.categoryId.set(product.categoryId);
    // Tomamos la primera imagen si tiene galeria
    this.imageUrl.set(product.images && product.images.length > 0 ? product.images[0].url : '');
    this.errorMessage.set('');
    this.showForm.set(true);
  }

  /** Cierra el formulario modal */
  closeForm() {
    this.showForm.set(false);
  }

  /** Llama al backend para procesar el envio del formulario */
  onSubmit() {
    // Estructuramos los datos en el formato que espera el Backend
    const payload = {
      name: this.name(),
      description: this.description() || null,
      price: Number(this.price()),
      stock: Number(this.stock()),
      categoryId: this.categoryId(),
      images: this.imageUrl() ? [this.imageUrl()] : [] // enviamos la URL como arreglo
    };

    if (this.isEditing()) {
      // EDITAR PRODUCTO (PATCH /products/:id) (Día 3 C)
      this.productService.update(this.editingProductId()!, payload).subscribe({
        next: () => {
          this.loadData(); // recarga la tabla
          this.closeForm(); // cierra modal
        },
        error: (err) => this.handleError(err), // maneja errores (ej: 409 duplicado)
      });
    } else {
      // CREAR PRODUCTO (POST /products) (Día 2 C)
      this.productService.create(payload).subscribe({
        next: () => {
          this.loadData(); // recarga la tabla
          this.closeForm(); // cierra modal
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  /** Elimina un producto previa confirmacion (Día 3 C) */
  onDelete(id: string) {
    // confirm() pide confirmacion interactiva al usuario
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadData(); // recarga la tabla despues de borrar
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  /** Muestra mensajes de error en pantalla para codigos de estado 400, 404, 409 (Día 3 C) */
  private handleError(err: any) {
    const status = err.status;
    const errorBody = err.error;

    if (status === 409) {
      this.errorMessage.set('El nombre del producto ya existe (Error 409). Intenta con otro.');
    } else if (status === 400) {
      const msg = errorBody?.message;
      this.errorMessage.set(
        Array.isArray(msg) 
          ? `Campos no válidos (400): ${msg.join(', ')}` 
          : `Campos no válidos (400): ${msg || 'Verifica los valores numéricos'}`
      );
    } else if (status === 404) {
      this.errorMessage.set('El producto solicitado no fue encontrado en el sistema (Error 404).');
    } else {
      this.errorMessage.set('Error en el servidor al procesar el producto.');
    }
  }
}
