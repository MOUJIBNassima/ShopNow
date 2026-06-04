// src/app/models/cart-item.model.ts

// On importe l'interface Product
import { Product } from './product.model';

// Un article du panier = un produit + une quantité
export interface CartItem {
  product: Product;   // Le produit ajouté
  quantity: number;   // La quantité choisie
}