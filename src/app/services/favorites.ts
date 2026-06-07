// src/app/services/favorites.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private favKey = 'shopnow_favorites';

  private favSubject = new BehaviorSubject<Product[]>(this.loadFavorites());
  favorites$ = this.favSubject.asObservable();

  constructor() { }

  // ─── Charger depuis localStorage ───────────────────────────────────────
  private loadFavorites(): Product[] {
    const data = localStorage.getItem(this.favKey);
    return data ? JSON.parse(data) : [];
  }

  // ─── Sauvegarder dans localStorage ─────────────────────────────────────
  private save(products: Product[]): void {
    localStorage.setItem(this.favKey, JSON.stringify(products));
    this.favSubject.next(products);
  }

  // ─── Obtenir les favoris actuels ────────────────────────────────────────
  getFavorites(): Product[] {
    return this.favSubject.getValue();
  }

  // ─── Ajouter / Retirer un favori (toggle) ──────────────────────────────
  toggleFavorite(product: Product): void {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(p => p.id === product.id);

    if (index === -1) {
      // Pas encore en favori → ajouter
      favorites.push(product);
    } else {
      // Déjà en favori → retirer
      favorites.splice(index, 1);
    }
    this.save(favorites);
  }

  // ─── Vérifier si un produit est en favori ──────────────────────────────
  isFavorite(productId: number): boolean {
    return this.getFavorites().some(p => p.id === productId);
  }

  // ─── Nombre de favoris ─────────────────────────────────────────────────
  getFavoritesCount(): number {
    return this.getFavorites().length;
  }

  // ─── Vider les favoris ─────────────────────────────────────────────────
  clearFavorites(): void {
    this.save([]);
  }
}