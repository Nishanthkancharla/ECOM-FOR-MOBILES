import { Injectable } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Mobile {
  id: number;
  brand: string;
  model: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  specs: {
    display: string;
    processor: string;
    ram: string;
    storage: string;
    camera: string;
    battery: string;
  };
  availableColors: string[];
  availableRAM: string[];
  availableStorage: string[];
  reviews: {
    rating: number;
    comment: string;
    author: string;
    date: string;
  }[];
  selectedColor?: string;
  selectedRAM?: string;
  selectedStorage?: string;
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
    // Check if the item already exists in cart
    const existingIndex = this.cart.findIndex(item => 
      item.id === mobile.id && 
      item.selectedColor === mobile.selectedColor &&
      item.selectedRAM === mobile.selectedRAM &&
      item.selectedStorage === mobile.selectedStorage
    );

    if (existingIndex === -1) {
      this.cart.push(mobile);
    } else {
      this.cart.splice(existingIndex, 1);
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  removeFromCart(index: number): void {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
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