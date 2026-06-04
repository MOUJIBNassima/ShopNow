// src/app/models/user.model.ts

// Interface pour un utilisateur inscrit
export interface User {
  id: number;          // Identifiant unique
  firstName: string;   // Prénom
  lastName: string;    // Nom de famille
  email: string;       // Email (utilisé pour la connexion)
  password: string;    // Mot de passe (stocké dans localStorage)
}

// Interface pour l'ordre/commande
export interface Order {
  id: number;
  userId: number;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  date: string;
  status: string;
}