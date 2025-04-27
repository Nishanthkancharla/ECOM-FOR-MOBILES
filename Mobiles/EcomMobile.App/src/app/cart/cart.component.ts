import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MobilesComponent } from '../mobiles/mobiles.component';
import { CartService, Mobile } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CartComponent {
  cart: Mobile[] = [];
  selectedItem: any = null;
  showDetails: boolean = false;
  fallbackImageUrl: string = 'assets/Images/iphone_15_pro_max.jpeg';
  exchangeRate: number = 83.0; // Current USD to INR rate (adjust as needed)
  
  // Message display properties
  showMessage: boolean = false;
  messageText: string = '';
  messageType: 'confirm' | 'success' | 'error' = 'confirm';
  pendingAction: (() => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cartService: CartService,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('cart');
      this.cart = savedCart ? JSON.parse(savedCart) : [];
    }
  }

  formatPrice(price: number | string): string {
    // If price is in dollars (contains $), convert to rupees
    if (typeof price === 'string' && price.toString().includes('$')) {
      const dollarAmount = parseFloat(price.toString().replace('$', '').trim());
      return `₹${(dollarAmount * this.exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    }
    // If price is already a number, format it in rupees
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₹${numericPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.fallbackImageUrl;
    imgElement.onerror = null; // Prevent infinite loop
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    } else if (url.startsWith('assets/')) {
      return url;
    } else {
      return `assets/Images/${url}`;
    }
  }

  showProductDetails(item: any) {
    this.selectedItem = item;
    this.showDetails = true;
  }

  closeDetails() {
    this.selectedItem = null;
    this.showDetails = false;
  }

  showConfirmMessage(message: string, action: () => void) {
    this.messageText = message;
    this.messageType = 'confirm';
    this.showMessage = true;
    this.pendingAction = action;
  }

  confirmAction() {
    if (this.pendingAction) {
      this.pendingAction();
      this.closeMessage();
    }
  }

  closeMessage() {
    this.showMessage = false;
    this.messageText = '';
    this.pendingAction = null;
  }

  removeFromCart(index: number) {
    this.showConfirmMessage(
      'Are you sure you want to remove this item from your cart?',
      () => {
        this.cartService.removeFromCart(index);
        this.cart = this.cartService.getCart();
        this.showMessage = false;
        this.messageText = 'Item removed from cart';
        this.messageType = 'success';
        setTimeout(() => this.closeMessage(), 2000);
      }
    );
  }

  clearCart() {
    this.showConfirmMessage(
      'Are you sure you want to clear your cart? This action cannot be undone.',
      () => {
        this.cartService.clearCart();
        this.cart = this.cartService.getCart();
        this.showMessage = false;
        this.messageText = 'Cart cleared successfully';
        this.messageType = 'success';
        setTimeout(() => this.closeMessage(), 2000);
      }
    );
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }

  placeOrder() {
    this.router.navigate(['/order-confirmation']);
  }

  private saveCart() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
} 