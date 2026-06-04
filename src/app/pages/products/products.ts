// src/app/pages/products/products.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {

  // Liste complète des produits (depuis JSON)
  allProducts: Product[] = [];

  // Liste filtrée affichée à l'écran
  filteredProducts: Product[] = [];

  // Catégories disponibles
  categories: string[] = [];

  // Catégorie sélectionnée
  selectedCategory: string = 'Tous';

  // Texte de recherche
  searchQuery: string = '';

  // Tri sélectionné
  selectedSort: string = 'default';

  // ID du produit en cours d'ajout (pour animation)
  addedProductId: number | null = null;

  // Chargement en cours
  isLoading: boolean = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts = products;
      this.filteredProducts = products;

      // Extraire les catégories avec 'Tous' en premier
      const cats = this.productService.getCategories(products);
      this.categories = ['Tous', ...cats];

      this.isLoading = false;
    });
  }

  // ─── Recherche en temps réel ────────────────────────────────────────────
  onSearch(): void {
    this.applyFilters();
  }

  // ─── Filtrer par catégorie ──────────────────────────────────────────────
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  // ─── Trier les produits ─────────────────────────────────────────────────
  onSortChange(): void {
    this.applyFilters();
  }

  // ─── Appliquer tous les filtres ensemble ────────────────────────────────
  applyFilters(): void {
    let result = [...this.allProducts];

    // 1. Filtre par catégorie
    result = this.productService.filterByCategory(
      result, this.selectedCategory
    );

    // 2. Filtre par recherche
    result = this.productService.searchProducts(result, this.searchQuery);

    // 3. Tri
    switch (this.selectedSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    this.filteredProducts = result;
  }

  // ─── Réinitialiser les filtres ──────────────────────────────────────────
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'Tous';
    this.selectedSort = 'default';
    this.filteredProducts = [...this.allProducts];
  }

  // ─── Ajouter au panier ──────────────────────────────────────────────────
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.addedProductId = product.id;
    setTimeout(() => {
      this.addedProductId = null;
    }, 2000);
  }

  // ─── Vérifier si produit dans le panier ────────────────────────────────
  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  // ─── Calcul réduction ───────────────────────────────────────────────────
  getDiscount(price: number, oldPrice: number): number {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  // ─── Étoiles rating ─────────────────────────────────────────────────────
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}