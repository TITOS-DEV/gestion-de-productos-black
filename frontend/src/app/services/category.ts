import { Injectable, inject } from '@angular/core'; // nos deja conectar los componentes con cualquier otro archvo
import { HttpClient } from '@angular/common/http'; // nos da los metodos par poder comunicarnos con el backend y hacer la peticiones 
import { Observable } from 'rxjs'; // sacamos de la libreria rxjs es un canal que que esta escuchando cuando los datos vayan a llegar del backend
import { environment } from '../../../environments/environment'; // configuracion de credenciales

@Injectable({
  providedIn: 'root' // crea una sola copia del servicio para toda la aplicacion 
})

export class CategoryService {
  private http = inject(HttpClient); // aca guardamos la importacion http en una variable 
  private apiUrl = `${environment.apiUrl}/categories`; // aca organizamos la url

  getAll(): Observable<any[]> { // con este estamos haceidno una llamada get para traer todas las categorias
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string): Observable<any> { // hacem,os un get  haciendo un filtro por id
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  create(categoryData: any): Observable<any> { // hacemos un post para mandar la creacion de una categoria
    return this.http.post<any>(this.apiUrl, categoryData);
  }

  update(id: string, categoryData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, categoryData);// actualizamos con un patch la categoria por el id
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`); //eliminamos con el id 
  }
}