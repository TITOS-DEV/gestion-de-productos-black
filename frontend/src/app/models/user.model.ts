// models/user.model.ts

/**
 * Representa al usuario autenticado.
 * Se obtiene en GET /users/me y viene incluido dentro de AuthResponse.
 * La contraseña nunca es devuelta por la API.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string; // fecha ISO
}