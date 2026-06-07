// src/app/pages/history/history.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HistoryService } from '../../services/history';
import { CartService } from '../../services/cart';
import { FavoritesService } from '../../services/favorites';
import { AuthService } from '../../services/auth';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class HistoryComponent implements OnInit {

  historyItems: Product[] = [];
  addedProductId: number | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private historyService: HistoryService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.historyService.history$.subscribe(items => {
      this.historyItems = items;
    });
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  removeItem(productId: number): void {
    this.historyService.removeFromHistory(productId);
  }

  clearAll(): void {
    this.historyService.clearHistory();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.addedProductId = product.id;
    setTimeout(() => { this.addedProductId = null; }, 2000);
  }

  toggleFavorite(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.favoritesService.toggleFavorite(product);
  }

  isFavorite(productId: number): boolean {
    return this.favoritesService.isFavorite(productId);
  }

  getDiscount(price: number, oldPrice: number): number {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }
}