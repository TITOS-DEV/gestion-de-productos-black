import { Injectable, signal } from '@angular/core';


// Define las posibles vistas que puede tener el modal de autenticación.
export type AuthView = 'login' | 'register';

/*
  Servicio encargado de gestionar el estado del modal de autenticación.
  Utiliza Signals de Angular para manejar el estado de forma reactiva y eficiente.
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
  /** Señal que indica si el modal está abierto (true) o cerrado (false). */
  isOpen = signal(false);
  
  // Señal que indica qué vista se muestra actualmente en el modal ('login' o 'register').
  view = signal<AuthView>('login');

  /*
    Abre el modal y muestra el formulario de inicio de sesión.
   */
  openLogin() {
    this.view.set('login');
    this.isOpen.set(true);
  }

  // Abre el modal y muestra el formulario de registro.
  openRegister() {
    this.view.set('register');
    this.isOpen.set(true);
  }

  // Cierra el modal.
  close() {
    this.isOpen.set(false);
  }

  /*
    Cambia la vista actual del modal sin alterar si está abierto o cerrado.
    @param view La nueva vista a mostrar ('login' o 'register').
  */
  switchTo(view: AuthView) {
    this.view.set(view);
  }
}