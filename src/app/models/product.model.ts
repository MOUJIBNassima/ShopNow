// src/app/models/product.model.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  brand: string;           // Nouveau champ : marque
  badge?: string;          // 'Promo' | 'Nouveau' | 'Populaire' | 'Best-seller'
}