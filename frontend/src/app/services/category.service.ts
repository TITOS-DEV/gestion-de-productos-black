import { Injectable, inject } from '@angular/core'; // nos deja conectar los componentes con cualquier otro archivo
import { HttpClient } from '@angular/common/http'; // nos da los metodos para poder comunicarnos con el backend y hacer las peticiones
import { Observable } from 'rxjs'; // sacamos de la libreria rxjs: es un canal que esta escuchando cuando los datos vayan a llegar del backend
import { Category } from '../models/category.model';
import { environment } from '../../environments/environment'; // configuracion de credenciales

@Injectable({
  providedIn: 'root' // crea una sola copia del servicio para toda la aplicacion
})
export class CategoryService {
  private http = inject(HttpClient); // aca guardamos la importacion http en una variable
  private apiUrl = `${environment.apiUrl}/categories`; // aca organizamos la url base de categorias

  /** con este estamos haciendo una llamada get para traer todas las categorias */
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  /** hacemos un get filtrando por el id de la categoria */
  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  /** hacemos un post para mandar la creacion de una nueva categoria */
  create(categoryData: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData);
  }

  /** actualizamos con un patch la categoria buscando por su id */
  update(id: string, categoryData: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, categoryData);
  }

  /** eliminamos la categoria usando su id */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
