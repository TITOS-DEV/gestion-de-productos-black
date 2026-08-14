// app.routes.ts
import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Products } from './pages/products/products';
import { Categories } from './pages/categories/categories';
import { Favorites } from './pages/favorites/favorites';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth.guard'; // ← ya activo

export const routes: Routes = [
  // — Rutas públicas —
  { path: '', component: Home },
  { path: 'products/:id', component: ProductDetail },

  // — Rutas protegidas —
  { path: 'admin/products', component: Products, canActivate: [authGuard], data: { role: 'admin' } },
  { path: 'categories', component: Categories, canActivate: [authGuard] },
  { path: 'favorites', component: Favorites, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  // — Fallback —
  { path: '**', redirectTo: '' },
];