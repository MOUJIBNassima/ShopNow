// src/app/pages/product-detail/product-detail.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { FavoritesService } from '../../services/favorites';
import { AuthService } from '../../services/auth';        // ← Ajouter
import { HistoryService } from '../../services/history';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

  product: Product | null = null;
  similarProducts: Product[] = [];
  quantity: number = 1;
  isAdded: boolean = false;
  isLoading: boolean = true;
  notFound: boolean = false;

  isFav: boolean = false;
  showLoginAlert: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService,             // ← Ajouter
    private historyService: HistoryService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.product = null;
      this.notFound = false;
      this.quantity = 1;
      this.isAdded = false;
      this.isLoading = true;
      this.loadProduct(id);
    });

    // S'abonner aux changements des favoris pour mettre à jour le bouton
    this.favoritesService.favorites$.subscribe(() => {
      if (this.product) {
        this.isFav = this.favoritesService.isFavorite(this.product.id);
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getAllProducts().subscribe(products => {
      this.product = products.find(p => p.id === id) || null;

      if (!this.product) {
        this.notFound = true;
        this.isLoading = false;
        return;
      }

      this.historyService.addToHistory(this.product);

      // Vérifier si déjà en favori
      this.isFav = this.favoritesService.isFavorite(this.product.id);

      this.similarProducts = products
        .filter(p => p.category === this.product!.category && p.id !== id)
        .slice(0, 3);

      this.isLoading = false;
    });
  }

  // MODIFIER — Protection favori
  toggleFavorite(): void {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.showLoginAlert = true;
      setTimeout(() => {
        this.showLoginAlert = false;
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: `/products/${this.product!.id}` }
        });
      }, 1500);
      return;
    }

    this.favoritesService.toggleFavorite(this.product);
    this.isFav = this.favoritesService.isFavorite(this.product.id);
  }

  increaseQty(): void {
    if (this.product && this.quantity < this.product.stock) this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.product) return;
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(this.product);
    }
    this.isAdded = true;
    setTimeout(() => { this.isAdded = false; }, 3000);
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  getDiscount(price: number, oldPrice: number): number {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
}