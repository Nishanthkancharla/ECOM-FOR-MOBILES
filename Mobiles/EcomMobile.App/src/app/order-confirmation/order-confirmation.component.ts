import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, Mobile } from '../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

interface Address {
  id: number;
  name: string;
  address: string;
  phone: string;
  type: string;
  isDefault?: boolean;
}

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  currentStep: number = 1; // Changed from 2 to 1 to start with Address step
  cartItems: Mobile[] = [];
  showAddressModal: boolean = false;
  showNewAddressForm: boolean = false;
  selectedAddressId: number = 1;
  selectedPaymentMethod: string = '';
  showCardForm: boolean = false;
  isPaymentValid: boolean = false;
  selectedBank: string = '';
  selectedEmiPlan: number = 0;
  isLoading: boolean = false;
  
  // Message display properties
  showMessage: boolean = false;
  messageText: string = '';
  messageType: 'success' | 'error' | 'confirm' = 'success';
  private pendingAction: (() => void) | null = null;

  cardDetails: CardDetails = {
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  };

  upiId: string = '';
  
  paymentMethods = [
    { id: 'card', label: 'Credit/Debit/ATM Card', icon: 'fa-credit-card' },
    { id: 'emi', label: 'EMI', icon: 'fa-clock' },
    { id: 'netbanking', label: 'Net Banking', icon: 'fa-university' },
    { id: 'upi', label: 'UPI', icon: 'fa-mobile-alt' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'fa-money-bill' }
  ];

  popularBanks = [
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' }
  ];

  emiPlans = [
    { tenure: 3, bank: 'HDFC Bank' },
    { tenure: 6, bank: 'ICICI Bank' },
    { tenure: 12, bank: 'Axis Bank' }
  ];

  savedAddresses: Address[] = [
    {
      id: 1,
      name: 'Nishanth Kancharla',
      address: 'Venkata ganapathi electricals &genaral stores, Golagudem bypass road near krishna temple, Amalapuram 533201',
      phone: '9063135355',
      type: 'HOME',
      isDefault: true
    },
    {
      id: 2,
      name: 'Nishanth Kancharla',
      address: '123 Work Street, Office Complex, Hyderabad 500001',
      phone: '9063135355',
      type: 'WORK'
    }
  ];

  newAddress: Address = {
    id: 0,
    name: '',
    address: '',
    phone: '',
    type: 'HOME'
  };

  get selectedAddress(): Address {
    return this.savedAddresses.find(addr => addr.id === this.selectedAddressId) || this.savedAddresses[0];
  }

  // Authentication related properties
  isLoggedIn: boolean = false;
  showLoginModal: boolean = false;
  showSignupModal: boolean = false;
  showForgotPasswordModal: boolean = false;
  loginEmail: string = '';
  loginPassword: string = '';
  signupName: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  signupPhone: string = '';
  forgotPasswordEmail: string = '';
  forgotPasswordEmailError: string = '';
  authError: string = '';

  private authSubscription: Subscription | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {
    // Remove the initial cart and auth checks from constructor
  }

  ngOnInit() {
    // Initialize auth state
    this.initializeAuthState();
    
    // Subscribe to auth changes
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.handleAuthStateChange(user);
    });

    // Load cart items
    this.loadCartItems();
  }

  private initializeAuthState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.closeAuthModals();
    }
  }

  private handleAuthStateChange(user: any) {
    const wasLoggedIn = this.isLoggedIn;
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn && !wasLoggedIn) {
      this.closeAuthModals();
      this.showSuccessMessage('Successfully logged in!');
    }
  }

  private loadCartItems() {
    this.cartItems = this.cartService.getCart();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.closeAuthModals();
    }
  }

  showLoginForm() {
    this.showLoginModal = true;
    this.showSignupModal = false;
    this.showForgotPasswordModal = false;
    this.authError = '';
  }

  showSignupForm() {
    this.showSignupModal = true;
    this.showLoginModal = false;
    this.showForgotPasswordModal = false;
    this.authError = '';
  }

  showForgotPasswordForm() {
    this.showForgotPasswordModal = true;
    this.showLoginModal = false;
    this.showSignupModal = false;
    this.authError = '';
  }

  closeAuthModals() {
    this.showLoginModal = false;
    this.showSignupModal = false;
    this.showForgotPasswordModal = false;
    this.authError = '';
    this.forgotPasswordEmailError = '';
  }

  async forgotPassword() {
    if (!this.forgotPasswordEmail) {
      this.forgotPasswordEmailError = 'Please enter your email address';
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.forgotPasswordEmail)) {
      this.forgotPasswordEmailError = 'Please enter a valid email address';
      return;
    }

    try {
      this.isLoading = true;
      // Here you would typically make an API call to handle password reset
      // For now, we'll just show a success message
      this.showSuccessMessage('Password reset instructions have been sent to your email');
      this.closeAuthModals();
    } catch (error) {
      this.forgotPasswordEmailError = 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  handleOrderButton() {
    if (this.currentStep < 3) {
      this.proceedToPayment();
      return;
    }

    // Check if user is logged in
    this.checkAuthStatus();
    
    if (!this.isLoggedIn) {
      this.showLoginForm();
      return;
    }

    if (!this.isPaymentValid) {
      this.showErrorMessage('Please complete the payment details before placing the order.');
      return;
    }

    this.placeOrder();
  }

  async placeOrder() {
    if (!this.isLoggedIn) {
      this.showLoginForm();
      return;
    }

    if (!this.isPaymentValid) {
      this.showErrorMessage('Please complete the payment details before placing the order.');
      return;
    }

    try {
      this.isLoading = true;
      
      // Show confirmation dialog
      this.showConfirmMessage('Are you sure you want to place this order?', async () => {
        try {
          // Here you would typically make an API call to process the order
          
          // Clear the cart
          this.cartService.clearCart();
          this.cartItems = [];
          
          // Show success message and redirect
          this.showSuccessMessage('Order placed successfully! Thank you for shopping with us.');
          
          // Wait for 2 seconds before redirecting
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
          
        } catch (error) {
          this.showErrorMessage('Failed to place order. Please try again.');
        } finally {
          this.isLoading = false;
        }
      });
    } catch (error) {
      this.showErrorMessage('An error occurred. Please try again.');
      this.isLoading = false;
    }
  }

  private async handleSuccessfulLogin() {
    this.closeAuthModals();
    this.showSuccessMessage('Login successful! You can now place your order.');
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.placeOrder();
  }

  async login() {
    if (!this.loginEmail || !this.loginPassword) {
      this.authError = 'Please enter both email and password';
      return;
    }

    try {
      this.isLoading = true;
      const response = await this.authService.login(this.loginEmail, this.loginPassword);
      if (response.success) {
        this.initializeAuthState();
        await this.handleSuccessfulLogin();
      } else {
        this.authError = response.message || 'Invalid email or password';
      }
    } catch (error) {
      this.authError = 'An error occurred during login. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async signup() {
    if (!this.signupName || !this.signupEmail || !this.signupPassword || !this.signupPhone) {
      this.authError = 'Please fill in all fields';
      return;
    }

    try {
      this.isLoading = true;
      const response = await this.authService.signup({
        name: this.signupName,
        email: this.signupEmail,
        password: this.signupPassword,
        phone: this.signupPhone
      });
      if (response.success) {
        this.initializeAuthState();
        this.showSuccessMessage('Account created successfully! You can now place your order.');
        this.signupName = '';
        this.signupEmail = '';
        this.signupPassword = '';
        this.signupPhone = '';
      } else {
        this.authError = response.message || 'Failed to create account';
      }
    } catch (error) {
      this.authError = 'An error occurred during signup. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }

  changeAddress() {
    this.showAddressModal = true;
  }

  closeAddressModal() {
    this.showAddressModal = false;
    this.showNewAddressForm = false;
  }

  selectAddress(addressId: number) {
    this.selectedAddressId = addressId;
    this.closeAddressModal();
    // Validate if we can proceed
    if (this.currentStep === 1) {
      this.proceedToPayment();
    }
  }

  showAddNewAddressForm() {
    this.showNewAddressForm = true;
  }

  addNewAddress() {
    if (this.newAddress.name && this.newAddress.address && this.newAddress.phone) {
      const newId = Math.max(...this.savedAddresses.map(a => a.id)) + 1;
      this.savedAddresses.push({
        ...this.newAddress,
        id: newId
      });
      this.selectedAddressId = newId;
      this.newAddress = {
        id: 0,
        name: '',
        address: '',
        phone: '',
        type: 'HOME'
      };
      this.closeAddressModal();
    }
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.showCardForm = method === 'card';
    // Reset selections when changing payment method
    if (method !== 'netbanking') this.selectedBank = '';
    if (method !== 'emi') this.selectedEmiPlan = 0;
    if (method !== 'upi') this.upiId = '';
    this.validatePayment();
  }

  validatePayment() {
    if (this.selectedPaymentMethod === 'card') {
      this.isPaymentValid = 
        this.cardDetails.cardNumber.length === 19 && // 16 digits + 3 spaces
        this.cardDetails.cardHolder.length > 0 &&
        this.cardDetails.expiryMonth.length > 0 &&
        this.cardDetails.expiryYear.length > 0 &&
        this.cardDetails.cvv.length === 3 &&
        this.validateExpiryDate();
    } else if (this.selectedPaymentMethod === 'upi') {
      // Validate UPI ID format (username@upi)
      this.isPaymentValid = this.upiId.includes('@') && this.upiId.length > 5;
    } else if (this.selectedPaymentMethod === 'netbanking') {
      // Validate bank selection
      this.isPaymentValid = this.selectedBank !== '';
    } else if (this.selectedPaymentMethod === 'emi') {
      // Validate EMI plan selection
      this.isPaymentValid = this.selectedEmiPlan > 0;
    } else if (this.selectedPaymentMethod === 'cod') {
      this.isPaymentValid = true; // COD is always valid
    } else {
      this.isPaymentValid = false;
    }
  }

  validateExpiryDate() {
    const month = parseInt(this.cardDetails.expiryMonth);
    const year = parseInt(this.cardDetails.expiryYear);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return year > currentYear || (year === currentYear && month >= currentMonth);
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.substr(0, 16);
    // Add space after every 4 digits
    const parts = value.match(/.{1,4}/g);
    event.target.value = parts ? parts.join(' ') : value;
    this.cardDetails.cardNumber = event.target.value;
    this.validatePayment(); // Add validation after formatting
  }

  proceedToPayment() {
    if (this.currentStep === 1) {
      // Validate address before proceeding
      if (!this.selectedAddress) {
        this.showErrorMessage('Please select a delivery address');
        return;
      }
      this.currentStep = 2;
      this.showSuccessMessage('Address confirmed! Please review your order summary.');
    } else if (this.currentStep === 2) {
      // Validate order summary before proceeding
      if (this.cartItems.length === 0) {
        this.showErrorMessage('Your cart is empty');
        return;
      }
      this.currentStep = 3;
      this.showSuccessMessage('Order summary confirmed! Please select your payment method.');
    }
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getButtonText(): string {
    if (this.currentStep < 3) {
      return 'Continue';
    }
    // Force check auth status before returning button text
    this.checkAuthStatus();
    return this.isLoggedIn ? 'Place Order' : 'Login to Place Order';
  }

  isOrderButtonDisabled(): boolean {
    if (this.currentStep < 3) {
      return false;
    }
    // Force check auth status
    this.checkAuthStatus();
    if (!this.isLoggedIn) {
      return false; // Allow clicking to show login modal
    }
    return !this.isPaymentValid;
  }

  selectBank(bankId: string) {
    this.selectedBank = bankId;
    this.validatePayment();
  }

  selectEmiPlan(tenure: number) {
    this.selectedEmiPlan = tenure;
    this.validatePayment();
  }

  onUpiIdChange() {
    this.validatePayment();
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
    this.pendingAction = null;
  }

  showSuccessMessage(message: string) {
    // Special formatting for order success message
    if (message.includes('Order placed successfully')) {
      const orderAmount = this.formatPrice(this.getTotal() + this.calculatePackagingFee());
      const deliveryDate = this.getEstimatedDeliveryDate();
      this.messageText = `
        🎉 Order Placed Successfully! 🎉
        
        Thank you for shopping with us.
        
        Order Amount: ${orderAmount}
        Expected Delivery: ${deliveryDate}
        
        You will receive an email confirmation shortly.
      `;
    } else {
      this.messageText = message;
    }
    
    this.messageType = 'success';
    this.showMessage = true;
    
    // For order success, show longer
    const duration = message.includes('Order placed successfully') ? 5000 : 3000;
    setTimeout(() => this.closeMessage(), duration);
  }

  showErrorMessage(message: string) {
    this.messageText = message;
    this.messageType = 'error';
    this.showMessage = true;
    setTimeout(() => this.closeMessage(), 3000);
  }

  removeFromCart(item: any) {
    this.showConfirmMessage('Are you sure you want to remove this item from your cart?', () => {
      this.cartService.removeFromCart(item);
      this.showSuccessMessage('Item removed from cart successfully');
    });
  }

  clearCart() {
    this.showConfirmMessage('Are you sure you want to clear your cart?', () => {
      this.cartService.clearCart();
      this.showSuccessMessage('Cart cleared successfully');
    });
  }

  // Add new methods for random fees and dates
  calculatePackagingFee(): number {
    const totalAmount = this.getTotal();
    // Calculate packaging fee based on order value
    // Higher value items get higher packaging fee
    if (totalAmount > 100000) {
      return Math.floor(Math.random() * (299 - 199) + 199); // 199-299 for premium phones
    } else if (totalAmount > 50000) {
      return Math.floor(Math.random() * (199 - 149) + 149); // 149-199 for mid-range phones
    } else {
      return Math.floor(Math.random() * (149 - 99) + 99); // 99-149 for budget phones
    }
  }

  getEstimatedDeliveryDate(): string {
    const today = new Date();
    // Random delivery between 3-7 days
    const deliveryDays = Math.floor(Math.random() * (7 - 3 + 1) + 3);
    const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
    
    // Format the date
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return `${deliveryDate.getDate()} ${months[deliveryDate.getMonth()]}, ${days[deliveryDate.getDay()]}`;
  }

  // Update getTotal to include packaging fee
  getTotalWithPackaging(): number {
    return this.getTotal() + this.calculatePackagingFee();
  }
} 