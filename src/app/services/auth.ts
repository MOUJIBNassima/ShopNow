// src/app/services/auth.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ─── Clés LocalStorage ─────────────────────────────────────────────────────
  private usersKey = 'shopnow_users';
  private currentUserKey = 'shopnow_current_user';

  // BehaviorSubject pour l'utilisateur connecté
  // null = personne connecté
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.loadCurrentUser()
  );

  // Observable public
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  // ─── Charger l'utilisateur connecté depuis LocalStorage ────────────────────
  private loadCurrentUser(): User | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  // ─── Récupérer tous les utilisateurs enregistrés ───────────────────────────
  private getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  // ─── Inscription ───────────────────────────────────────────────────────────
  register(firstName: string, lastName: string,
           email: string, password: string): boolean {

    const users = this.getUsers();

    // Vérifier si l'email existe déjà
    const emailExists = users.some(u => u.email === email);
    if (emailExists) return false; // Échec : email déjà utilisé

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: Date.now(), // ID unique basé sur le timestamp
      firstName,
      lastName,
      email,
      password // ⚠️ En prod, on hasherait le mot de passe !
    };

    // Sauvegarder dans la liste des utilisateurs
    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    // Connecter automatiquement après inscription
    this.setCurrentUser(newUser);
    return true; // Succès
  }

  // ─── Connexion ─────────────────────────────────────────────────────────────
  login(email: string, password: string): boolean {
    const users = this.getUsers();

    // Chercher l'utilisateur avec email + mot de passe correspondants
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      this.setCurrentUser(user);
      return true; // Connexion réussie
    }

    return false; // Échec : identifiants incorrects
  }

  // ─── Déconnexion ───────────────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.currentUserSubject.next(null);
  }

  // ─── Sauvegarder l'utilisateur connecté ────────────────────────────────────
  private setCurrentUser(user: User): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // ─── Vérifier si quelqu'un est connecté ────────────────────────────────────
  isLoggedIn(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  // ─── Obtenir l'utilisateur connecté ────────────────────────────────────────
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}