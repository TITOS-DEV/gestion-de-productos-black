import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  // En Angular 22 los componentes ya son standalone por defecto,
  // por eso no escribimos "standalone: true".
  imports: [FormsModule,RouterLink], // necesario para poder usar [(ngModel)]
  templateUrl: './login.html', // sin ".component", así lo nombra el CLI en v22
  styleUrl: './login.css',
})
export class LoginComponent {
  // inject() es la forma moderna de traer dependencias.
  // AuthService trae la lógica de login, Router nos permite
  // redirigir después de un login exitoso.
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estas variables están enlazadas al HTML mediante [(ngModel)].
  // Cuando el usuario escribe en el input, Angular actualiza esta
  // variable automáticamente (y viceversa).
  email = '';
  password = '';

  // Mensaje de error a mostrar en pantalla. Vacío al inicio.
  errorMessage = '';

  onSubmit() {
    // ── Validación básica ──
    // Se ejecuta ANTES de llamar a la API, para no mandar una
    // petición innecesaria si el usuario dejó campos vacíos.
    if (!this.email || !this.password) {
      this.errorMessage = 'Debes completar email y contraseña';
      return; // corta la función aquí, no sigue al login
    }

    // ── Llamada a la API ──
    // login() devuelve un Observable, por eso usamos .subscribe()
    // para "escuchar" el resultado en vez de un simple await.
    this.authService.login(this.email, this.password).subscribe({
      // Se ejecuta si la API respondió OK (200).
      // El AuthService ya guardó el token internamente,
      // aquí solo nos encargamos de redirigir.
      next: () => {
        this.router.navigate(['/']); // manda al Home
      },
      // Se ejecuta si la API respondió con error
      // (por ejemplo 401 si el email o password son incorrectos).
      error: (err) => {
        this.errorMessage = 'Email o contraseña incorrectos';
        console.error(err); // útil mientras depuras
      },
    });
  }
}