// src/app/pages/cart/cart.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  cartItems: CartItem[] = [];
  shippingFee: number = 5.99;
  freeShippingThreshold: number = 50;

  // Correction : constructor AVANT ngOnInit
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  increase(productId: number, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decrease(productId: number, currentQty: number): void {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getSubtotal(): number {
    return this.cartService.getTotal();
  }

  getShipping(): number {
    return this.getSubtotal() >= this.freeShippingThreshold
      ? 0 : this.shippingFee;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShipping();
  }

  getItemCount(): number {
    return this.cartService.getItemCount();
  }

  getRemainingForFreeShipping(): number {
    return Math.max(0, this.freeShippingThreshold - this.getSubtotal());
  }

  getShippingProgress(): number {
    return Math.min(100,
      (this.getSubtotal() / this.freeShippingThreshold) * 100
    );
  }
}