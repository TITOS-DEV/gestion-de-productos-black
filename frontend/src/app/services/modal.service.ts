import { Injectable, signal } from '@angular/core';

export type AuthView = 'login' | 'register';

@Injectable({ providedIn: 'root' })
export class ModalService {
  isOpen = signal(false);
  view = signal<AuthView>('login');
  returnUrl: string | null = null; // a dónde volver tras login exitoso

  openLogin(returnUrl: string | null = null) {
    this.view.set('login');
    this.returnUrl = returnUrl;
    this.isOpen.set(true);
  }

  openRegister() {
    this.view.set('register');
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  switchTo(view: AuthView) {
    this.view.set(view);
  }
}