import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Tres campos del formulario, cada uno enlazado a un input
  // mediante [(ngModel)] en el HTML.
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  onSubmit() {
    // ── Validación básica: campos vacíos ──
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    // ── Validación básica: longitud de password ──
    // La API exige mínimo 6 caracteres. Validarlo aquí evita
    // mandar una petición que sabemos que la API va a rechazar (400).
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    // ── Llamada a la API ──
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        // Aunque el registro ya deja al usuario logueado (la API
        // devuelve accessToken igual que en login), lo mandamos a
        // /login para separar claramente "crear cuenta" de "usar la cuenta".
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // 409 = conflicto: el email ya existe en la base de datos.
        if (err.status === 409) {
          this.errorMessage = 'Ese correo ya está registrado';
        } else {
          this.errorMessage = 'Ocurrió un error, intenta de nuevo';
        }
        console.error(err);
      },
    });
  }
}