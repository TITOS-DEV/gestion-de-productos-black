// app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Products } from './pages/products/products';
import { Categories } from './pages/categories/categories';
import { Favorites } from './pages/favorites/favorites';
import { Profile } from './pages/profile/profile';
// import { authGuard } from './guards/auth.guard';
// ↑ lo activa A cuando el guard esté implementado

export const routes: Routes = [
  // ── Rutas públicas ──
  { path: '', component: Home },
  { path: 'products/:id', component: ProductDetail },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // ── Rutas protegidas ──
  // canActivate: [authGuard] lo conecta A en su commit del guard
  { path: 'admin/products', component: Products },
  { path: 'categories', component: Categories },
  { path: 'favorites', component: Favorites },
  { path: 'profile', component: Profile },

  // ── Fallback ──
  { path: '**', redirectTo: '' },
];
