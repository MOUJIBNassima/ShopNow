// src/app/pages/products/products.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { FavoritesService } from '../../services/favorites';
import { Product } from '../../models/product.model';
import { AuthService } from '../../services/auth';  

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];

  // ─── Filtres ────────────────────────────────────────────────────────────
  selectedCategory: string = 'Tous';
  searchQuery: string = '';
  selectedSort: string = 'default';

  // Fourchette de prix
  minPrice: number = 0;
  maxPrice: number = 2000;
  currentMinPrice: number = 0;
  currentMaxPrice: number = 2000;

  // Note minimum
  minRating: number = 0;

  // Stock disponible uniquement
  onlyInStock: boolean = false;

  // Badges
  selectedBadge: string = 'Tous';
  badges: string[] = ['Tous', 'Promo', 'Nouveau', 'Populaire'];

  // Panneau filtres avancés ouvert/fermé
  showAdvancedFilters: boolean = false;

  addedProductId: number | null = null;
  isLoading: boolean = true;

  //Messgae de notification
  showLoginAlert: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts = products;
      this.filteredProducts = products;
      this.categories = ['Tous', ...this.productService.getCategories(products)];

      // Calculer le prix max réel depuis les données
      this.maxPrice = Math.max(...products.map(p => p.price));
      this.currentMaxPrice = this.maxPrice;

      this.isLoading = false;
    });
  }

  // ─── Appliquer tous les filtres ─────────────────────────────────────────
  applyFilters(): void {
    let result = [...this.allProducts];

    // 1. Catégorie
    result = this.productService.filterByCategory(result, this.selectedCategory);

    // 2. Recherche texte
    result = this.productService.searchProducts(result, this.searchQuery);

    // 3. Fourchette de prix
    result = result.filter(p =>
      p.price >= this.currentMinPrice && p.price <= this.currentMaxPrice
    );

    // 4. Note minimum
    if (this.minRating > 0) {
      result = result.filter(p => p.rating >= this.minRating);
    }

    // 5. Stock disponible
    if (this.onlyInStock) {
      result = result.filter(p => p.stock > 0);
    }

    // 6. Badge
    if (this.selectedBadge !== 'Tous') {
      result = result.filter(p => p.badge === this.selectedBadge);
    }

    // 7. Tri
    switch (this.selectedSort) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
      case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    this.filteredProducts = result;
  }

  onSearch(): void         { this.applyFilters(); }
  onCategoryChange(c: string): void { this.selectedCategory = c; this.applyFilters(); }
  onSortChange(): void     { this.applyFilters(); }
  onPriceChange(): void    { this.applyFilters(); }
  onRatingChange(): void   { this.applyFilters(); }
  onStockChange(): void    { this.applyFilters(); }
  onBadgeChange(b: string): void { this.selectedBadge = b; this.applyFilters(); }

  // Vérifier si des filtres avancés sont actifs
  hasActiveFilters(): boolean {
    return this.searchQuery !== '' ||
           this.selectedCategory !== 'Tous' ||
           this.currentMinPrice > 0 ||
           this.currentMaxPrice < this.maxPrice ||
           this.minRating > 0 ||
           this.onlyInStock ||
           this.selectedBadge !== 'Tous';
  }

  // Réinitialiser tous les filtres
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'Tous';
    this.selectedSort = 'default';
    this.currentMinPrice = 0;
    this.currentMaxPrice = this.maxPrice;
    this.minRating = 0;
    this.onlyInStock = false;
    this.selectedBadge = 'Tous';
    this.filteredProducts = [...this.allProducts];
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.addedProductId = product.id;
    setTimeout(() => { this.addedProductId = null; }, 2000);
  }

  toggleFavorite(product: Product): void {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      // Afficher un message pendant 2 secondes puis rediriger
      this.showLoginAlert = true;
      setTimeout(() => {
        this.showLoginAlert = false;
        // Rediriger vers login avec l'URL de retour
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: '/products' }
        });
      }, 1500);
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

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Étoiles pour le filtre note
  getRatingStars(n: number): number[] {
    return Array(n).fill(0);
  }
}