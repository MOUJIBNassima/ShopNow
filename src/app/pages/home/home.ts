// src/app/pages/home/home.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product.model';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  // Tous les produits chargés depuis le JSON
  allProducts: Product[] = [];

  // Produits populaires (badge = 'Populaire')
  featuredProducts: Product[] = [];

  // Catégories uniques
  categories: string[] = [];

  // Message confirmation ajout panier
  addedProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Charger les produits depuis le JSON
    this.productService.getAllProducts().subscribe(products => {
      this.allProducts = products;

      // Extraire les produits populaires
      this.featuredProducts = products
        .filter(p => p.badge === 'Populaire')
        .slice(0, 3); // Max 3 produits en vedette

      // Extraire les catégories uniques
      this.categories = this.productService.getCategories(products);
    });
  }

  // Ajouter au panier depuis la Home
  addToCart(product: Product): void {
    this.cartService.addToCart(product);

    // Afficher confirmation pendant 2 secondes
    this.addedProductId = product.id;
    setTimeout(() => {
      this.addedProductId = null;
    }, 2000);
  }

  // Calculer le pourcentage de réduction
  getDiscount(price: number, oldPrice: number): number {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  // Générer un tableau pour afficher les étoiles
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
  @ViewChild('categoriesTrack') categoriesTrack!: ElementRef;

scrollCategories(direction: 'left' | 'right'): void {
  const track = this.categoriesTrack.nativeElement;
  const scrollAmount = 300;
  track.scrollBy({
    left: direction === 'right' ? scrollAmount : -scrollAmount,
    behavior: 'smooth'
  });
}
}