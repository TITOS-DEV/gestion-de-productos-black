// app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Products } from './pages/products/products';
import { Categories } from './pages/categories/categories';
import { Favorites } from './pages/favorites/favorites';
import { Profile } from './pages/profile/profile';
// import { authGuard } from './guards/auth.guard';
// ↑ se importa y se activa en el commit feat(guard), todavía no existe

export const routes: Routes = [
  // ── Rutas públicas ──
  // No requieren sesión iniciada.

  {
    path: '', // Home: listado, búsqueda y filtro por categoría
    component: Home,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },

  // ── Rutas protegidas ──
  // Requieren sesión. El guard se conecta en un commit posterior
  // (canActivate: [authGuard] queda comentado por ahora).

  {
    path: 'products', // Admin: listar, crear, editar, eliminar productos
    component: Products,
    // canActivate: [authGuard],
  },
  {
    path: 'categorias', // Admin: CRUD de categorías
    component: Categories,
    // canActivate: [authGuard],
  },
  {
    path: 'favorites', // Productos favoritos del usuario autenticado
    component: Favorites,
    // canActivate: [authGuard],
  },
  {
    path: 'profile', // Datos del usuario + cambio de contraseña
    component: Profile,
    // canActivate: [authGuard],
  },

  // ── Fallback ──
  // Cualquier ruta no definida redirige al Home.
  {
    path: '**',
    redirectTo: '',
  },
];