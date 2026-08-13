import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private usersService = inject(UsersService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  passwordError = '';
  passwordSuccess = '';

  ngOnInit() {
    this.usersService.getProfile().subscribe({
      error: (err) => console.error('No se pudo cargar el perfil', err),
    });
  }

  get profile() {
    return this.usersService.profile();
  }

  onChangePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Todos los campos son obligatorios';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordError = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }

    this.usersService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res) => {
        this.passwordSuccess = res.message;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.passwordError = err.status === 401
          ? 'Contraseña actual incorrecta'
          : 'Ocurrió un error, intenta de nuevo';
        console.error(err);
      },
    });
  }
}