import { Injectable, inject } from '@angular/core'; // nos deja conectar los componentes con cualquier otro archvo
import { HttpClient } from '@angular/common/http'; // nos da los metodos par poder comunicarnos con el backend y hacer la peticiones 
import { Observable } from 'rxjs'; // sacamos de la libreria rxjs es un canal que que esta escuchando cuando los datos vayan a llegar del backend
import { Category } from '../models/category.model'; // importamos el modelo para tipar los datos fuertemente
import { environment } from '../../../environments/environment'; // configuracion de credenciales

@Injectable({
  providedIn: 'root' // crea una sola copia del servicio para toda la aplicacion 
})
export class CategoryService {
  private http = inject(HttpClient); // aca guardamos la importacion http en una variable 
  private apiUrl = `${environment.apiUrl}/categories`; // aca organizamos la url

  getAll(): Observable<Category[]> { // con este estamos haceidno una llamada get para traer todas las categorias
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id: string): Observable<Category> { // hacem,os un get  haciendo un filtro por id
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  create(categoryData: Partial<Category>): Observable<Category> { // hacemos un post para mandar la creacion de una categoria
    return this.http.post<Category>(this.apiUrl, categoryData);
  }

  update(id: string, categoryData: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, categoryData);// actualizamos con un patch la categoria por el id
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); //eliminamos con el id 
  }
}