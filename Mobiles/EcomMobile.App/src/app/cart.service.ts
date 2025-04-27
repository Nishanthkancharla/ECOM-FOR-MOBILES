import { Injectable } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Mobile {
  id: number;
  brand: string;
  model: string;
  price: number;
  imageUrl: string;
  category: string;
  specs: {
    display: string;
    storage: string;
    camera: string;
    battery: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Mobile[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      this.cart = savedCart ? JSON.parse(savedCart) : [];
    }
  }

  getCart(): Mobile[] {
    return this.cart;
  }

  addToCart(mobile: Mobile): void {
    this.cart.push(mobile);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  clearCart(): void {
    this.cart = [];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }
} 