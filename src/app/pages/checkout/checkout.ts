// src/app/pages/checkout/checkout.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  currentStep: number = 1;
  orderSuccess: boolean = false;
  orderNumber: string = '';
  shippingFee: number = 5.99;
  freeShippingThreshold: number = 50;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName:     ['', [Validators.required]],
      lastName:      ['', [Validators.required]],
      email:         ['', [Validators.required, Validators.email]],
      phone:         ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address:       ['', [Validators.required, Validators.minLength(5)]],
      city:          ['', [Validators.required]],
      zipCode:       ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country:       ['Maroc', [Validators.required]],
      paymentMethod: ['card', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();

    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email
      });
    }
  }

  // ✅ Correction NG8107 : ajout du ! pour garantir non-null
  get firstName()     { return this.checkoutForm.get('firstName')!; }
  get lastName()      { return this.checkoutForm.get('lastName')!; }
  get email()         { return this.checkoutForm.get('email')!; }
  get phone()         { return this.checkoutForm.get('phone')!; }
  get address()       { return this.checkoutForm.get('address')!; }
  get city()          { return this.checkoutForm.get('city')!; }
  get zipCode()       { return this.checkoutForm.get('zipCode')!; }
  get paymentMethod() { return this.checkoutForm.get('paymentMethod')!; }

  getSubtotal(): number { return this.cartService.getTotal(); }

  getShipping(): number {
    return this.getSubtotal() >= this.freeShippingThreshold ? 0 : this.shippingFee;
  }

  getTotal(): number { return this.getSubtotal() + this.getShipping(); }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.orderNumber = 'SN-' + Date.now().toString().slice(-6).toUpperCase();
    this.cartService.clearCart();
    this.orderSuccess = true;
    this.currentStep = 2;
  }

  goHome(): void { this.router.navigate(['/']); }
}