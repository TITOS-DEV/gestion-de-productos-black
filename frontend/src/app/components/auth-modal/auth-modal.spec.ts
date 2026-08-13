import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModal } from './auth-modal';

/**
 * Archivo de pruebas unitarias para el componente AuthModal.
 * Aquí se configuran y ejecutan las pruebas (tests) para asegurar
 * que el componente se crea y funciona correctamente.
 */
describe('AuthModal', () => {
  let component: AuthModal;
  let fixture: ComponentFixture<AuthModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
