// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { FavoritesComponent } from './pages/favorites/favorites';
import { HistoryComponent } from './pages/history/history';
import { AccountComponent } from './pages/account/account';

export const routes: Routes = [

  // ─── Page d'accueil ──────────────────────────────────────────────────────
  {
    path: '',
    component: Home,
    title: 'ShopNow — Accueil'
  },

  // ─── Liste des produits ───────────────────────────────────────────────────
  {
    path: 'products',
    component: Products,
    title: 'ShopNow — Produits'
  },

  // ─── Détail d'un produit ──────────────────────────────────────────────────
  {
    path: 'products/:id',
    component: ProductDetail,
    title: 'ShopNow — Détail Produit'
  },

  // ─── Panier ───────────────────────────────────────────────────────────────
  {
    path: 'cart',
    component: Cart,
    title: 'ShopNow — Panier'
  },

  // ─── Checkout (protégé) ───────────────────────────────────────────────────
  {
    path: 'checkout',
    component: Checkout,
    title: 'ShopNow — Commande',
    canActivate: [authGuard]
  },

  // ─── Favoris ──────────────────────────────────────────────────────────────
  {
    path: 'favorites',
    component: FavoritesComponent,
    title: 'ShopNow — Favoris',
    canActivate: [authGuard]
  },

  // ─── Historique de navigation ─────────────────────────────────────────────
  {
    path: 'history',
    component: HistoryComponent,
    title: 'ShopNow — Historique'
  },

  // ─── Mon Compte (protégé) ─────────────────────────────────────────────────
  {
    path: 'account',
    component: AccountComponent,
    title: 'ShopNow — Mon Compte',
    canActivate: [authGuard]
  },

  // ─── Connexion ────────────────────────────────────────────────────────────
  {
    path: 'login',
    component: Login,
    title: 'ShopNow — Connexion'
  },

  // ─── Inscription ──────────────────────────────────────────────────────────
  {
    path: 'register',
    component: Register,
    title: 'ShopNow — Inscription'
  },

  // ─── Redirection si route inconnue ────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
