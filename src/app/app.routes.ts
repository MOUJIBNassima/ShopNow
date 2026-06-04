// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

// Importation de tous les composants/pages
import { Home } from './pages/home/home';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

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

  // ─── Détail d'un produit (route avec paramètre :id) ───────────────────────
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

  // ─── Checkout (protégé : faut être connecté) ──────────────────────────────
  {
    path: 'checkout',
    component: Checkout,
    title: 'ShopNow — Commande',
    canActivate: [authGuard]   // ← Guard : redirige vers login si non connecté
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
    path: '**',              // ** = toute route qui n'existe pas
    redirectTo: '',
    pathMatch: 'full'
  }
];