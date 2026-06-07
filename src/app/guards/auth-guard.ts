// src/app/guards/auth-guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Guard fonctionnel (style Angular 17+)
export const authGuard: CanActivateFn = (route, state) => {

  // On injecte les services avec inject() — style standalone
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Utilisateur connecté → accès autorisé
    return true;
  } else {
    // Non connecté → redirection vers login
    router.navigate(['/login']);
    return false;
  }
};