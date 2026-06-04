// src/app/services/product.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'assets/data/products.json';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getCategories(products: Product[]): string[] {
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  }

  searchProducts(products: Product[], query: string): Product[] {
    if (!query.trim()) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterByCategory(products: Product[], category: string): Product[] {
    if (category === 'Tous') return products;
    return products.filter(p => p.category === category);
  }
}