// src/app/services/cart.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // ─── Clé LocalStorage ──────────────────────────────────────────────────────
  private cartKey = 'shopnow_cart';

  // BehaviorSubject : stocke les articles ET notifie tous les composants
  // qui l'écoutent quand le panier change (ex: navbar badge)
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadCart());

  // Observable public que les composants vont écouter
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() { }

  // ─── Charger le panier depuis LocalStorage ─────────────────────────────────
  private loadCart(): CartItem[] {
    const cart = localStorage.getItem(this.cartKey);
    // Si panier existe → le parser, sinon → tableau vide
    return cart ? JSON.parse(cart) : [];
  }

  // ─── Sauvegarder le panier dans LocalStorage ───────────────────────────────
  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    // Notifier tous les composants abonnés
    this.cartItemsSubject.next(items);
  }

  // ─── Obtenir les articles actuels ──────────────────────────────────────────
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }

  // ─── Ajouter un produit au panier ──────────────────────────────────────────
  addToCart(product: Product): void {
    const items = this.getCartItems();

    // Vérifier si le produit est déjà dans le panier
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      // Si oui → augmenter la quantité
      existingItem.quantity += 1;
    } else {
      // Si non → ajouter un nouvel article
      items.push({ product, quantity: 1 });
    }

    this.saveCart(items);
  }

  // ─── Supprimer un produit du panier ────────────────────────────────────────
  removeFromCart(productId: number): void {
    const items = this.getCartItems().filter(
      item => item.product.id !== productId
    );
    this.saveCart(items);
  }

  // ─── Modifier la quantité d'un article ─────────────────────────────────────
  updateQuantity(productId: number, quantity: number): void {
    const items = this.getCartItems();
    const item = items.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        // Si quantité = 0 → supprimer l'article
        this.removeFromCart(productId);
        return;
      }
      item.quantity = quantity;
    }

    this.saveCart(items);
  }

  // ─── Calculer le total du panier ───────────────────────────────────────────
  getTotal(): number {
    return this.getCartItems().reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0 // Valeur initiale du total
    );
  }

  // ─── Calculer le nombre total d'articles ───────────────────────────────────
  getItemCount(): number {
    return this.getCartItems().reduce(
      (count, item) => count + item.quantity,
      0
    );
  }

  // ─── Vider le panier ───────────────────────────────────────────────────────
  clearCart(): void {
    this.saveCart([]);
  }

  // ─── Vérifier si un produit est dans le panier ─────────────────────────────
  isInCart(productId: number): boolean {
    return this.getCartItems().some(item => item.product.id === productId);
  }
}