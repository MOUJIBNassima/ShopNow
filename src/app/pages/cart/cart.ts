// src/app/pages/cart/cart.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  // Articles du panier
  cartItems: CartItem[] = [];

  // Frais de livraison
  shippingFee: number = 5.99;

  // Seuil livraison gratuite
  freeShippingThreshold: number = 50;

  ngOnInit(): void {
    // S'abonner aux changements du panier
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  constructor(private cartService: CartService) { }

  // Augmenter la quantité
  increase(productId: number, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  // Diminuer la quantité
  decrease(productId: number, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  // Supprimer un article
  remove(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  // Vider le panier
  clearCart(): void {
    this.cartService.clearCart();
  }

  // Total des articles
  getSubtotal(): number {
    return this.cartService.getTotal();
  }

  // Livraison (gratuite si > seuil)
  getShipping(): number {
    return this.getSubtotal() >= this.freeShippingThreshold
      ? 0
      : this.shippingFee;
  }

  // Total final
  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }

  // Nombre total d'articles
  getItemCount(): number {
    return this.cartService.getItemCount();
  }

  // Montant restant pour livraison gratuite
  getRemainingForFreeShipping(): number {
    return Math.max(0, this.freeShippingThreshold - this.getSubtotal());
  }

  // Pourcentage de progression vers livraison gratuite
  getShippingProgress(): number {
    return Math.min(100,
      (this.getSubtotal() / this.freeShippingThreshold) * 100
    );
  }
}