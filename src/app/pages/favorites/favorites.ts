// src/app/pages/favorites/favorites.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit {

  favorites: Product[] = [];
  addedProductId: number | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.favoritesService.favorites$.subscribe(favs => {
      this.favorites = favs;
    });
  }

  // Retirer des favoris
  removeFromFavorites(productId: number): void {
    const product = this.favorites.find(p => p.id === productId)!;
    this.favoritesService.toggleFavorite(product);
  }

  // Ajouter au panier depuis les favoris
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.addedProductId = product.id;
    setTimeout(() => { this.addedProductId = null; }, 2000);
  }

  // Vider tous les favoris
  clearAll(): void {
    this.favoritesService.clearFavorites();
  }

  // Calcul réduction
  getDiscount(price: number, oldPrice: number): number {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }
}