// models/product-image.model.ts

/**
 * Una imagen dentro de la galería de un producto.
 * El arreglo Product.images ya viene ordenado por "order" ascendente.
 */
export interface ProductImage {
  id: string;
  url: string;
  order: number; // 0 = primera imagen
}