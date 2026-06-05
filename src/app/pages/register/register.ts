// src/app/pages/register/register.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      confirm:   ['', [Validators.required]],
      terms:     [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirm  = form.get('confirm')?.value;
    if (password !== confirm) {
      form.get('confirm')?.setErrors({ mismatch: true });
    }
    return null;
  }

  // ✅ Correction NG8107 : ajout du ! pour garantir non-null
  get firstName() { return this.registerForm.get('firstName')!; }
  get lastName()  { return this.registerForm.get('lastName')!; }
  get email()     { return this.registerForm.get('email')!; }
  get password()  { return this.registerForm.get('password')!; }
  get confirm()   { return this.registerForm.get('confirm')!; }
  get terms()     { return this.registerForm.get('terms')!; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { firstName, lastName, email, password } = this.registerForm.value;

    setTimeout(() => {
      const success = this.authService.register(firstName, lastName, email, password);
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Cet email est déjà utilisé.';
        this.isLoading = false;
      }
    }, 800);
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirm(): void  { this.showConfirm  = !this.showConfirm; }
}