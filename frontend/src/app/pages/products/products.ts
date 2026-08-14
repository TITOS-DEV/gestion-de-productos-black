import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Loading } from '../../components/ui/loading/loading';

@Component({
  selector: 'app-products',
  imports: [Loading, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  showForm = signal(false);
  isEditing = signal(false);
  editingProductId = signal<string | null>(null);

  name = signal('');
  description = signal('');
  price = signal(0);
  stock = signal(0);
  categoryId = signal('');
  imageUrl = signal('');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.errorMessage.set('Error al cargar la lista de categorías.')
    });

    this.productService.getAll().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al cargar la lista de productos.');
        this.isLoading.set(false);
      }
    });
  }

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

  openEditForm(product: Product) {
    this.isEditing.set(true);
    this.editingProductId.set(product.id);
    this.name.set(product.name);
    this.description.set(product.description || '');
    this.price.set(product.price);
    this.stock.set(product.stock);
    this.categoryId.set(product.categoryId);
    this.imageUrl.set(product.images && product.images.length > 0 ? product.images[0].url : '');
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
      price: Number(this.price()),
      stock: Number(this.stock()),
      categoryId: this.categoryId(),
      images: this.imageUrl() ? [this.imageUrl()] : []
    };

    if (this.isEditing()) {
      this.productService.update(this.editingProductId()!, payload).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
        },
        error: (err) => this.handleError(err),
      });
    } else {
      this.productService.create(payload).subscribe({
        next: () => {
          this.loadData();
          this.closeForm();
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  onDelete(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => this.handleError(err),
      });
    }
  }

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
