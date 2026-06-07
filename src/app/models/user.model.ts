// src/app/models/user.model.ts

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;       // Date d'inscription
}

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
  status: 'En cours' | 'Livrée' | 'Annulée';
  shippingAddress: string;
  paymentMethod: string;
}