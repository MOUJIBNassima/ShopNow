// src/app/pages/account/account.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { OrderService } from '../../services/order';
import { FavoritesService } from '../../services/favorites';
import { User, Order } from '../../models/user.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class AccountComponent implements OnInit {

  currentUser: User | null = null;
  orders: Order[] = [];
  favoritesCount: number = 0;
  activeTab: 'profile' | 'orders' = 'profile';
  profileForm: FormGroup;
  saveSuccess: boolean = false;
  expandedOrderId: string | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private favoritesService: FavoritesService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      phone:     [''],
      address:   [''],
      city:      [''],
      zipCode:   [''],
      country:   ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.currentUser = user;
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName:  user.lastName,
        email:     user.email,
        phone:     user.phone    || '',
        address:   user.address  || '',
        city:      user.city     || '',
        zipCode:   user.zipCode  || '',
        country:   user.country  || ''
      });
      this.orders = this.orderService.getOrdersByUser(user.id);
    });

    this.favoritesService.favorites$.subscribe(() => {
      this.favoritesCount = this.favoritesService.getFavoritesCount();
    });
  }

  setTab(tab: 'profile' | 'orders'): void {
    this.activeTab = tab;
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.currentUser) return;

    const usersKey = 'shopnow_users';
    const users: User[] = JSON.parse(localStorage.getItem(usersKey) || '[]');
    const idx = users.findIndex(u => u.id === this.currentUser!.id);

    const updated: User = {
      ...this.currentUser,
      ...this.profileForm.value
    };

    if (idx !== -1) users[idx] = updated;
    localStorage.setItem(usersKey, JSON.stringify(users));
    localStorage.setItem('shopnow_current_user', JSON.stringify(updated));
    this.currentUser = updated;
    (this.authService as any).currentUserSubject?.next(updated);

    this.saveSuccess = true;
    setTimeout(() => { this.saveSuccess = false; }, 3000);
  }

  toggleOrder(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Livrée':  return 'status-delivered';
      case 'Annulée': return 'status-cancelled';
      default:        return 'status-pending';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Livrée':  return '✅';
      case 'Annulée': return '❌';
      default:        return '🚚';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  get firstName() { return this.profileForm.get('firstName')!; }
  get lastName()  { return this.profileForm.get('lastName')!; }
  get email()     { return this.profileForm.get('email')!; }
}
