// models/product.model.ts
import { Category } from './category.model';
import { ProductImage } from './product-image.model';

/**
 * Representa un producto.
 * Nota: "category" viene como objeto completo, no solo el id.
 * "images" es un arreglo de ProductImage, no de strings.
 */
export interface Product {
  id: string;
  name: string; // único
  description: string | null;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}