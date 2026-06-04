// src/app/components/navbar/navbar.ts

import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  // Nombre d'articles dans le panier (affiché dans le badge)
  cartCount: number = 0;

  // Utilisateur connecté
  currentUser: User | null = null;

  // Menu mobile ouvert/fermé
  isMenuOpen: boolean = false;

  // Navbar avec fond (après scroll)
  isScrolled: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // S'abonner aux changements du panier
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getItemCount();
    });

    // S'abonner aux changements d'authentification
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Détecter le scroll pour changer le style de la navbar
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  // Ouvrir/fermer le menu mobile
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Fermer le menu mobile
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Déconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMenu();
  }
}