import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../models/user-profile.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/users/me';

  profile = signal<UserProfile | null>(null);

  getProfile() {
    return this.http.get<UserProfile>(this.apiUrl).pipe(
      tap((user) => this.profile.set(user))
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/password`, {
      currentPassword,
      newPassword,
    });
  }
}