// src/app/pages/product-detail/product-detail.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

  // Produit affiché
  product: Product | null = null;

  // Produits similaires (même catégorie)
  similarProducts: Product[] = [];

  // Quantité sélectionnée
  quantity: number = 1;

  // Message confirmation
  isAdded: boolean = false;

  // Chargement
  isLoading: boolean = true;

  // Produit non trouvé
  notFound: boolean = false;

  constructor(
    private route: ActivatedRoute,     // Pour lire l'ID dans l'URL
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Lire le paramètre :id depuis l'URL
    this.route.params.subscribe(params => {
      const id = +params['id']; // + convertit string → number
      this.product = null;
      this.notFound = false;
      this.quantity = 1;
      this.isAdded = false;
      this.loadProduct(id);
    });
  }

  // Charger le produit par ID
  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe(products => {

      // Trouver le produit avec l'ID correspondant
      this.product = products.find(p => p.id === id) || null;

      if (!this.product) {
        this.notFound = true;
        this.isLoading = false;
        return;
      }

      // Produits similaires : même catégorie, différent ID, max 3
      this.similarProducts = products
        .filter(p => p.category === this.product!.category && p.id !== id)
        .slice(0, 3);

      this.isLoading = false;
    });
  }

  // Augmenter la quantité
  increaseQty(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  // Diminuer la quantité
  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Ajouter au panier avec la quantité choisie
  addToCart(): void {
    if (!this.product) return;

    // Ajouter autant de fois que la quantité
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(this.product);
    }

    this.isAdded = true;
    setTimeout(() => { this.isAdded = false; }, 3000);
  }

  // Aller directement au panier
  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  // Calcul réduction
  getDiscount(price: number, oldPrice: number): number {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  // Étoiles
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Étoiles vides
  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.floor(rating)).fill(0);
  }
}