// models/auth-response.model.ts
import { User } from './user.model';

/**
 * Respuesta de POST /auth/login y POST /auth/register.
 * Ojo: la propiedad es "accessToken", no "token".
 */
export interface AuthResponse {
  accessToken: string;
  user: User;
}