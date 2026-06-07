// src/app/services/order.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order, OrderItem } from '../models/user.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersKey = 'shopnow_orders';

  private ordersSubject = new BehaviorSubject<Order[]>(this.loadOrders());
  orders$ = this.ordersSubject.asObservable();

  constructor() { }

  private loadOrders(): Order[] {
    const data = localStorage.getItem(this.ordersKey);
    return data ? JSON.parse(data) : [];
  }

  private save(orders: Order[]): void {
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  // ─── Sauvegarder une commande ──────────────────────────────────────────────
  saveOrder(
    userId: number,
    cartItems: CartItem[],
    subtotal: number,
    shipping: number,
    shippingAddress: string,
    paymentMethod: string
  ): Order {
    const items: OrderItem[] = cartItems.map(ci => ({
      productId: ci.product.id,
      productName: ci.product.name,
      productImage: ci.product.image,
      quantity: ci.quantity,
      unitPrice: ci.product.price,
      total: ci.product.price * ci.quantity
    }));

    const order: Order = {
      id: 'SN-' + Date.now().toString().slice(-6).toUpperCase(),
      userId,
      items,
      subtotal,
      shipping,
      total: subtotal + shipping,
      date: new Date().toISOString(),
      status: 'En cours',
      shippingAddress,
      paymentMethod
    };

    const orders = this.loadOrders();
    orders.unshift(order); // Ajouter en premier
    this.save(orders);
    return order;
  }

  // ─── Commandes d'un utilisateur ───────────────────────────────────────────
  getOrdersByUser(userId: number): Order[] {
    return this.loadOrders().filter(o => o.userId === userId);
  }

  // ─── Toutes les commandes ──────────────────────────────────────────────────
  getAllOrders(): Order[] {
    return this.ordersSubject.getValue();
  }

  // ─── Nombre de commandes d'un utilisateur ─────────────────────────────────
  getOrdersCount(userId: number): number {
    return this.getOrdersByUser(userId).length;
  }
}
