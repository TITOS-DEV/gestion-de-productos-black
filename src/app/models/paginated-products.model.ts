// models/paginated-products.model.ts
import { Product } from './product.model';

/**
 * GET /products no devuelve un arreglo plano de productos,
 * sino un objeto paginado. Se usa como tipo de respuesta
 * al listar productos (Home y pantalla admin de Products).
 */
export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}