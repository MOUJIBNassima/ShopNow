// src/app/models/product.model.ts

// Interface qui définit la structure d'un produit
export interface Product {
  id: number;           // Identifiant unique
  name: string;         // Nom du produit
  price: number;        // Prix en euros
  oldPrice?: number;    // Ancien prix (optionnel, pour afficher une promo)
  description: string;  // Description du produit
  category: string;     // Catégorie (ex: "Électronique")
  image: string;        // URL de l'image
  rating: number;       // Note (ex: 4.5)
  reviews: number;      // Nombre d'avis
  stock: number;        // Quantité en stock
  badge?: string;       // Badge optionnel (ex: "Nouveau", "Promo")
}