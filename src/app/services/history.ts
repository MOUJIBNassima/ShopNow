// src/app/services/history.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private historyKey = 'shopnow_history';
  private maxItems = 10; // Garder les 10 derniers produits consultés

  private historySubject = new BehaviorSubject<Product[]>(
    this.loadHistory()
  );
  history$ = this.historySubject.asObservable();

  constructor() { }

  private loadHistory(): Product[] {
    const data = localStorage.getItem(this.historyKey);
    return data ? JSON.parse(data) : [];
  }

  private save(products: Product[]): void {
    localStorage.setItem(this.historyKey, JSON.stringify(products));
    this.historySubject.next(products);
  }

  // ─── Ajouter un produit consulté ───────────────────────────────────────
  addToHistory(product: Product): void {
    const history = this.loadHistory();

    // Retirer si déjà présent (pour le remettre en premier)
    const filtered = history.filter(p => p.id !== product.id);

    // Ajouter en début de liste
    filtered.unshift(product);

    // Garder seulement les maxItems derniers
    const trimmed = filtered.slice(0, this.maxItems);

    this.save(trimmed);
  }

  // ─── Obtenir l'historique ───────────────────────────────────────────────
  getHistory(): Product[] {
    return this.historySubject.getValue();
  }

  // ─── Supprimer un produit de l'historique ──────────────────────────────
  removeFromHistory(productId: number): void {
    const history = this.getHistory().filter(p => p.id !== productId);
    this.save(history);
  }

  // ─── Vider l'historique ────────────────────────────────────────────────
  clearHistory(): void {
    this.save([]);
  }

  // ─── Nombre de produits consultés ──────────────────────────────────────
  getHistoryCount(): number {
    return this.getHistory().length;
  }
}