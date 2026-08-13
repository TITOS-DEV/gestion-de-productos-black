// services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3001';

  /**
   * Señal reactiva del estado de sesión.
   * Se inicializa leyendo si ya existe un token guardado (por ejemplo,
   * si el usuario refresca la página sin haber cerrado sesión).
   */
  isLoggedIn = signal<boolean>(!!localStorage.getItem('accessToken'));

  /**
   * POST /auth/login
   * Si la API responde OK, guarda el token y marca la sesión como activa.
   */
  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.setSession(res)));
  }

  /**
   * POST /auth/register
   * password debe tener mínimo 6 caracteres (validar en el formulario
   * antes de llamar esto, para evitar un 400 innecesario).
   * Si el email ya existe, la API responde 409.
   */
  register(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/register`, { name, email, password })
      .pipe(tap((res) => this.setSession(res)));
  }

  /**
   * POST /auth/logout — requiere JWT.
   * Por eso se llama a la API ANTES de borrar el token (si lo borráramos
   * primero, el interceptor ya no tendría token que mandar en el header).
   * Como el JWT es stateless, el backend no invalida nada: quien
   * realmente cierra sesión es el frontend, borrando el token local.
   * Se limpia la sesión tanto si la llamada tiene éxito como si falla.
   */
  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  /**
   * Usado por el interceptor para leer el token y agregarlo
   * al header Authorization de las peticiones protegidas.
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('accessToken', res.accessToken);
    this.isLoggedIn.set(true);
  }

  private clearSession() {
    localStorage.removeItem('accessToken');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}