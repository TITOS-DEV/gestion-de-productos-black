// models/category.model.ts

/**
 * Representa una categoría de producto.
 * Usada en /categories (CRUD) y dentro de Product.category.
 */
export interface Category {
  id: string;
  name: string; // único, no distingue mayúsculas/minúsculas
  description: string | null;
  createdAt: string;
  updatedAt: string;
}