import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/**
 * Componente que representa la ventana modal de autenticación.
 * Permite a los usuarios iniciar sesión o registrarse.
 */
@Component({
  selector: 'app-auth-modal',
  imports: [FormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.css',
})
export class AuthModal {
  modal = inject(ModalService);
  private authService = inject(AuthService);
  private router = inject(Router);
  // Variables enlazadas al formulario mediante ngModel
  loginEmail = '';
  loginPassword = '';

  registerName = '';
  registerEmail = '';
  registerPassword = '';

  // Almacena y muestra mensajes de error (ej. credenciales inválidas)
  errorMessage = '';

  /**
   * Obtiene la vista actual ('login' o 'register') desde el ModalService.
   */
  get view() {
    return this.modal.view();
  }

  /**
   * Cambia la vista activa dentro del modal limpiando primero cualquier error.
   */
  switchView(view: 'login' | 'register') {
    this.errorMessage = '';
    this.modal.switchTo(view);
  }

  /**
   * Cierra el modal y limpia el mensaje de error.
   */
  close() {
    this.errorMessage = '';
    this.modal.close();
  }

  /**
   * Cierra el modal si se hace clic fuera de la tarjeta (en el fondo oscuro).
   * @param event El evento de clic del ratón.
   */
  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   */
  onLoginSubmit() {
  if (!this.loginEmail || !this.loginPassword) {
    this.errorMessage = 'Debes completar email y contraseña';
    return;
  }
  this.authService.login(this.loginEmail, this.loginPassword).subscribe({
    next: () => {
      const returnUrl = this.modal.returnUrl;
      this.loginEmail = '';
      this.loginPassword = '';
      this.modal.returnUrl = null;
      this.close();
      if (returnUrl) {
        this.router.navigate([returnUrl]);
      }
    },
    error: (err) => {
      this.errorMessage = 'Email o contraseña incorrectos';
      console.error(err);
    },
  });
}
  /**
   * Maneja el envío del formulario de registro.
   */
  onRegisterSubmit() {
    if (!this.registerName || !this.registerEmail || !this.registerPassword) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }
    if (this.registerPassword.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }
    this.authService.register(this.registerName, this.registerEmail, this.registerPassword).subscribe({
      next: () => {
        this.loginEmail = this.registerEmail;
        this.registerName = '';
        this.registerEmail = '';
        this.registerPassword = '';
        this.errorMessage = '';
        this.switchView('login');
      },
      error: (err) => {
        this.errorMessage = err.status === 409
          ? 'Ese correo ya está registrado'
          : 'Ocurrió un error, intenta de nuevo';
        console.error(err);
      },
    });
  }
}