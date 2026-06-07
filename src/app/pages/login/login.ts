// src/app/pages/login/login.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router'; // ← Ajouter ActivatedRoute
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;

  // AJOUTER — URL de retour après connexion
  private returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute   // ← Ajouter
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Lire le returnUrl depuis les query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get email()    { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    setTimeout(() => {
      const success = this.authService.login(email, password);
      if (success) {
        // Rediriger vers la page d'origine
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect.';
        this.isLoading = false;
      }
    }, 800);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}