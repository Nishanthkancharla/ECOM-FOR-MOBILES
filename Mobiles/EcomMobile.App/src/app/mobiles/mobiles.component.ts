import { Component, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Mobile } from '../services/cart.service';
import { AuthService, User } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mobiles',
  templateUrl: './mobiles.component.html',
  styleUrls: ['./mobiles.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class MobilesComponent implements OnInit, OnDestroy {
  mobiles: Mobile[] = [];
  cart: Mobile[] = [];
  selectedCategory: string = 'all';
  categories: string[] = ['all', 'premium', 'mid-range', 'budget'];
  brands: string[] = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nothing', 'ASUS', 'Motorola', 'Vivo', 'Oppo'];
  searchQuery: string = '';
  defaultImageUrl: string = 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816';
  selectedMobile: Mobile | null = null;
  showDetails: boolean = false;
  newReview = {
    rating: 5,
    comment: '',
    author: '',
    date: new Date().toISOString().split('T')[0]
  };
  showLoginDropdown = false;
  showLoginModal = false;
  showSignupModal = false;
  showForgotPasswordModal = false;
  loginEmail: string = '';
  loginPassword: string = '';
  emailError: string = '';
  passwordError: string = '';
  passwordRequirements = {
    length: false,
    specialChar: false,
    number: false,
    capitalLetter: false
  };

  // Signup form properties
  signupName: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  signupConfirmPassword: string = '';
  signupEmailError: string = '';
  signupPasswordError: string = '';
  signupConfirmPasswordError: string = '';
  signupPasswordRequirements = {
    length: false,
    specialChar: false,
    number: false,
    capitalLetter: false
  };

  // Forgot Password properties
  forgotPasswordEmail: string = '';
  forgotPasswordEmailError: string = '';
  resetPasswordSuccess: boolean = false;

  // Add property for registered users
  private registeredUsers: { name: string; email: string; password: string; }[] = [];
  currentUser: User | null = null;
  private authSubscription: Subscription | null = null;

  // Message display properties
  showMessage: boolean = false;
  messageText: string = '';
  messageType: 'confirm' | 'success' | 'error' = 'confirm';
  pendingAction: (() => void) | null = null;

  authError: string = '';
  signupPhone: string = '';
  loginError: string = '';
  signupError: string = '';
  isLoading: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Initialize auth state
    const storedUser = this.authService.getCurrentStoredUser();
    if (storedUser) {
      this.currentUser = storedUser;
    }
    
    // Delete specified user accounts
    this.authService.deleteUsersByEmails([
      'nishanthkancharla124@gmail.com',
      'nishanthkancharla355@gmail.com'
    ]);

    // Subscribe to auth state changes
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Auth state updated:', user);
    });

    this.mobiles = [
      // Apple Devices (15 variants)
      {
        id: 1,
        brand: 'Apple',
        model: 'iPhone 15 Pro Max',
        description: 'The most powerful iPhone ever with A17 Pro chip and titanium design',
        price: 159999,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.7" Super Retina XDR',
          processor: 'A17 Pro',
          ram: '8GB',
          storage: '256GB',
          camera: '48MP Triple Camera',
          battery: '4422mAh'
        },
        availableColors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
        availableRAM: ['8GB'],
        availableStorage: ['256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Amazing phone with incredible performance and camera quality!',
            author: 'John Doe',
            date: '2024-01-15'
          },
          {
            rating: 4,
            comment: 'Great phone but a bit expensive. Camera is outstanding.',
            author: 'Jane Smith',
            date: '2024-01-10'
          }
        ]
      },
      {
        id: 2,
        brand: 'Apple',
        model: 'iPhone 15 Pro',
        description: 'Premium iPhone with A17 Pro chip and titanium frame',
        price: 134900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-natural-titanium-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.1" Super Retina XDR',
          processor: 'A17 Pro',
          ram: '8GB',
          storage: '256GB',
          camera: '48MP Triple Camera',
          battery: '3274mAh'
        },
        availableColors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
        availableRAM: ['8GB'],
        availableStorage: ['256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Perfect size and amazing performance!',
            author: 'Mike Johnson',
            date: '2024-01-12'
          }
        ]
      },
      {
        id: 3,
        brand: 'Apple',
        model: 'iPhone 15 Plus',
        description: 'Large display iPhone with A16 Bionic',
        price: 89900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-plus-pink-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.7" Super Retina XDR',
          processor: 'A16 Bionic',
          ram: '6GB',
          storage: '128GB',
          camera: '48MP Dual Camera',
          battery: '4383mAh'
        },
        availableColors: ['Pink', 'Blue', 'Green', 'Black'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great battery life and display!',
            author: 'Sarah Wilson',
            date: '2024-01-08'
          }
        ]
      },
      {
        id: 4,
        brand: 'Apple',
        model: 'iPhone 15',
        description: 'Advanced dual-camera system and A16 Bionic chip',
        price: 79900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pink-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.1" Super Retina XDR',
          processor: 'A16 Bionic',
          ram: '6GB',
          storage: '128GB',
          camera: '48MP Dual Camera',
          battery: '3349mAh'
        },
        availableColors: ['Pink', 'Blue', 'Green', 'Black'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great value for money!',
            author: 'David Brown',
            date: '2024-01-05'
          }
        ]
      },
      {
        id: 5,
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        description: 'Previous generation flagship with A16 Bionic',
        price: 129900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-max-deep-purple-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.7" Super Retina XDR',
          processor: 'A16 Bionic',
          ram: '6GB',
          storage: '256GB',
          camera: '48MP Triple Camera',
          battery: '4323mAh'
        },
        availableColors: ['Deep Purple', 'Gold', 'Silver', 'Space Black'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Still an amazing phone!',
            author: 'Emily Davis',
            date: '2024-01-03'
          }
        ]
      },
      {
        id: 6,
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        description: 'Previous generation premium iPhone',
        price: 119900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-deep-purple-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.1" Super Retina XDR',
          processor: 'A16 Bionic',
          ram: '6GB',
          storage: '256GB',
          camera: '48MP Triple Camera',
          battery: '3200mAh'
        },
        availableColors: ['Deep Purple', 'Gold', 'Silver', 'Space Black'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great camera and performance!',
            author: 'Robert Taylor',
            date: '2024-01-01'
          }
        ]
      },
      {
        id: 7,
        brand: 'Apple',
        model: 'iPhone 14 Plus',
        description: 'Large display iPhone with A15 Bionic',
        price: 79900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-plus-purple-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.7" Super Retina XDR',
          processor: 'A15 Bionic',
          ram: '6GB',
          storage: '128GB',
          camera: '12MP Dual Camera',
          battery: '4325mAh'
        },
        availableColors: ['Purple', 'Blue', 'Midnight', 'Starlight'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great battery life and large display!',
            author: 'Lisa Anderson',
            date: '2024-01-02'
          }
        ]
      },
      {
        id: 8,
        brand: 'Apple',
        model: 'iPhone 14',
        description: 'Standard iPhone with A15 Bionic',
        price: 69900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-purple-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.1" Super Retina XDR',
          processor: 'A15 Bionic',
          ram: '6GB',
          storage: '128GB',
          camera: '12MP Dual Camera',
          battery: '3279mAh'
        },
        availableColors: ['Purple', 'Blue', 'Midnight', 'Starlight'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Solid performance and great camera!',
            author: 'Tom Wilson',
            date: '2024-01-04'
          }
        ]
      },
      {
        id: 9,
        brand: 'Apple',
        model: 'iPhone 13 Pro Max',
        description: 'Previous generation flagship with A15 Bionic',
        price: 109900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-sierra-blue-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.7" Super Retina XDR',
          processor: 'A15 Bionic',
          ram: '6GB',
          storage: '256GB',
          camera: '12MP Triple Camera',
          battery: '4352mAh'
        },
        availableColors: ['Sierra Blue', 'Graphite', 'Gold', 'Silver'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Still a great phone with amazing battery life!',
            author: 'Chris Brown',
            date: '2024-01-06'
          }
        ]
      },
      {
        id: 10,
        brand: 'Apple',
        model: 'iPhone 13 Pro',
        description: 'Previous generation premium iPhone',
        price: 99900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-sierra-blue-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.1" Super Retina XDR',
          processor: 'A15 Bionic',
          ram: '6GB',
          storage: '256GB',
          camera: '12MP Triple Camera',
          battery: '3095mAh'
        },
        availableColors: ['Sierra Blue', 'Graphite', 'Gold', 'Silver'],
        availableRAM: ['6GB'],
        availableStorage: ['128GB', '256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 4,
            comment: 'Excellent camera and performance!',
            author: 'Emma Davis',
            date: '2024-01-07'
          }
        ]
      },
      {
        id: 11,
        brand: 'Apple',
        model: 'iPhone 13',
        description: 'Previous generation standard iPhone',
        price: 69900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pink-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '6.1" Super Retina XDR',
          processor: 'A15 Bionic',
          ram: '4GB',
          storage: '128GB',
          camera: '12MP Dual Camera',
          battery: '3240mAh'
        },
        availableColors: ['Pink', 'Blue', 'Midnight', 'Starlight'],
        availableRAM: ['4GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great value for the price!',
            author: 'James Wilson',
            date: '2024-01-09'
          }
        ]
      },
      {
        id: 12,
        brand: 'Apple',
        model: 'iPhone 13 mini',
        description: 'Compact iPhone with A15 Bionic',
        price: 59900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-mini-pink-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'premium',
        specs: {
          display: '5.4" Super Retina XDR',
          processor: 'A15 Bionic',
          ram: '4GB',
          storage: '128GB',
          camera: '12MP Dual Camera',
          battery: '2406mAh'
        },
        availableColors: ['Pink', 'Blue', 'Midnight', 'Starlight'],
        availableRAM: ['4GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Perfect size for one-handed use!',
            author: 'Sophie Taylor',
            date: '2024-01-11'
          }
        ]
      },
      {
        id: 13,
        brand: 'Apple',
        model: 'iPhone SE (2022)',
        description: 'Compact iPhone with A15 Bionic',
        price: 49900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-se-midnight-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'mid-range',
        specs: {
          display: '4.7" Retina HD',
          processor: 'A15 Bionic',
          ram: '4GB',
          storage: '128GB',
          camera: '12MP Single Camera',
          battery: '2018mAh'
        },
        availableColors: ['Midnight', 'Starlight', 'Red'],
        availableRAM: ['4GB'],
        availableStorage: ['64GB', '128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great compact phone with powerful chip!',
            author: 'Michael Brown',
            date: '2024-01-13'
          }
        ]
      },
      {
        id: 14,
        brand: 'Apple',
        model: 'iPhone 12',
        description: 'Previous generation iPhone with A14 Bionic',
        price: 49900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-12-purple-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'mid-range',
        specs: {
          display: '6.1" Super Retina XDR',
          processor: 'A14 Bionic',
          ram: '4GB',
          storage: '128GB',
          camera: '12MP Dual Camera',
          battery: '2815mAh'
        },
        availableColors: ['Purple', 'Blue', 'Green', 'Red', 'White', 'Black'],
        availableRAM: ['4GB'],
        availableStorage: ['64GB', '128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Still a great phone for the price!',
            author: 'Olivia Davis',
            date: '2024-01-14'
          }
        ]
      },
      {
        id: 15,
        brand: 'Apple',
        model: 'iPhone 11',
        description: 'Previous generation iPhone with A13 Bionic',
        price: 39900,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-purple-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816',
        category: 'mid-range',
        specs: {
          display: '6.1" Liquid Retina HD',
          processor: 'A13 Bionic',
          ram: '4GB',
          storage: '128GB',
          camera: '12MP Dual Camera',
          battery: '3110mAh'
        },
        availableColors: ['Purple', 'Green', 'Yellow', 'Red', 'White', 'Black'],
        availableRAM: ['4GB'],
        availableStorage: ['64GB', '128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great budget iPhone option!',
            author: 'Daniel Wilson',
            date: '2024-01-16'
          }
        ]
      },

      // Samsung Devices (15 variants)
      {
        id: 16,
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        description: 'Samsung\'s flagship with S Pen and 200MP camera',
        price: 129999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-s928-sm-s928bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '6.8" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          ram: '12GB',
          storage: '512GB',
          camera: '200MP Quad Camera',
          battery: '5000mAh'
        },
        availableColors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
        availableRAM: ['12GB'],
        availableStorage: ['256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Incredible camera and S Pen functionality!',
            author: 'Alex Johnson',
            date: '2024-01-17'
          }
        ]
      },
      {
        id: 17,
        brand: 'Samsung',
        model: 'Galaxy S24+',
        description: 'Premium Samsung experience with enhanced performance',
        price: 99999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-plus-s928-sm-s928bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '6.7" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4900mAh'
        },
        availableColors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
        availableRAM: ['12GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Perfect balance of size and performance!',
            author: 'Sarah Miller',
            date: '2024-01-18'
          }
        ]
      },
      {
        id: 18,
        brand: 'Samsung',
        model: 'Galaxy S24',
        description: 'Standard flagship with powerful performance',
        price: 79999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '6.2" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 3',
          ram: '8GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4000mAh'
        },
        availableColors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Great compact flagship with amazing performance!',
            author: 'Michael Chen',
            date: '2024-01-23'
          }
        ]
      },
      {
        id: 19,
        brand: 'Samsung',
        model: 'Galaxy Z Fold 5',
        description: 'Premium foldable with S Pen support',
        price: 154999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-z-fold5-f946-sm-f946bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '7.6" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '512GB',
          camera: '50MP Triple Camera',
          battery: '4400mAh'
        },
        availableColors: ['Phantom Black', 'Cream', 'Icy Blue', 'Gray'],
        availableRAM: ['12GB'],
        availableStorage: ['256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Incredible foldable experience with S Pen support!',
            author: 'David Kim',
            date: '2024-01-24'
          }
        ]
      },
      {
        id: 20,
        brand: 'Samsung',
        model: 'Galaxy Z Flip 5',
        description: 'Compact foldable with large cover screen',
        price: 99999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-z-flip5-f731-sm-f731bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '6.7" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 2',
          ram: '8GB',
          storage: '256GB',
          camera: '12MP Dual Camera',
          battery: '3700mAh'
        },
        availableColors: ['Mint', 'Graphite', 'Cream', 'Lavender'],
        availableRAM: ['8GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Perfect compact foldable with great cover screen!',
            author: 'Sarah Lee',
            date: '2024-01-25'
          }
        ]
      },
      {
        id: 21,
        brand: 'Samsung',
        model: 'Galaxy S23 Ultra',
        description: 'Previous generation flagship with S Pen',
        price: 109999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-s23-ultra-s918-sm-s918bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '6.8" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '512GB',
          camera: '200MP Quad Camera',
          battery: '5000mAh'
        },
        availableColors: ['Phantom Black', 'Cream', 'Green', 'Lavender'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Amazing camera and S Pen functionality!',
            author: 'John Smith',
            date: '2024-01-20'
          }
        ]
      },
      {
        id: 22,
        brand: 'Samsung',
        model: 'Galaxy S23+',
        description: 'Previous generation premium model',
        price: 84999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-s23-plus-s916-sm-s916bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '6.6" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 2',
          ram: '8GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4700mAh'
        },
        availableColors: ['Phantom Black', 'Cream', 'Green', 'Lavender'],
        availableRAM: ['8GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great performance and battery life!',
            author: 'Sarah Johnson',
            date: '2024-01-21'
          }
        ]
      },
      {
        id: 23,
        brand: 'Samsung',
        model: 'Galaxy S23',
        description: 'Previous generation standard model',
        price: 74999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-s23-s911-sm-s911bzadins-thumb-537371344',
        category: 'premium',
        specs: {
          display: '6.1" Dynamic AMOLED 2X',
          processor: 'Snapdragon 8 Gen 2',
          ram: '8GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '3900mAh'
        },
        availableColors: ['Phantom Black', 'Cream', 'Green', 'Lavender'],
        availableRAM: ['8GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Perfect compact flagship!',
            author: 'Michael Brown',
            date: '2024-01-22'
          }
        ]
      },
      {
        id: 24,
        brand: 'Samsung',
        model: 'Galaxy A54 5G',
        description: 'Premium mid-range with good camera',
        price: 38999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2303/gallery/in-galaxy-a54-5g-a546-sm-a546elgdins-thumb-537371344',
        category: 'mid-range',
        specs: {
          display: '6.4" Super AMOLED',
          processor: 'Exynos 1380',
          ram: '8GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '5000mAh'
        },
        availableColors: ['Awesome Lime', 'Awesome Graphite', 'Awesome Violet', 'Awesome White'],
        availableRAM: ['6GB', '8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great mid-range phone with excellent camera!',
            author: 'Emily Wilson',
            date: '2024-01-23'
          }
        ]
      },
      {
        id: 25,
        brand: 'Samsung',
        model: 'Galaxy A34 5G',
        description: 'Mid-range phone with good display',
        price: 30999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2303/gallery/in-galaxy-a34-5g-a346-sm-a346elgdins-thumb-537371344',
        category: 'mid-range',
        specs: {
          display: '6.6" Super AMOLED',
          processor: 'Dimensity 1080',
          ram: '8GB',
          storage: '128GB',
          camera: '48MP Triple Camera',
          battery: '5000mAh'
        },
        availableColors: ['Awesome Silver', 'Awesome Violet', 'Awesome Lime', 'Awesome Graphite'],
        availableRAM: ['6GB', '8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great value for money with excellent display!',
            author: 'James Wilson',
            date: '2024-01-24'
          }
        ]
      },
      {
        id: 26,
        brand: 'Samsung',
        model: 'Galaxy M34 5G',
        description: 'Budget 5G phone with good battery',
        price: 18999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-m34-5g-m346-sm-m346bzadins-thumb-537371344',
        category: 'budget',
        specs: {
          display: '6.5" Super AMOLED',
          processor: 'Exynos 1280',
          ram: '6GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '6000mAh'
        },
        availableColors: ['Midnight Blue', 'Prism Silver', 'Jade Green'],
        availableRAM: ['6GB', '8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great battery life and smooth performance!',
            author: 'Robert Chen',
            date: '2024-01-25'
          }
        ]
      },
      {
        id: 27,
        brand: 'Samsung',
        model: 'Galaxy F34 5G',
        description: 'Budget phone with good display',
        price: 17999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2308/gallery/in-galaxy-f34-5g-f346-sm-f346bzadins-thumb-537371344',
        category: 'budget',
        specs: {
          display: '6.5" Super AMOLED',
          processor: 'Exynos 1280',
          ram: '6GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '6000mAh'
        },
        availableColors: ['Electric Black', 'Mystic Green', 'Orchid Purple'],
        availableRAM: ['6GB', '8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Excellent display and battery backup!',
            author: 'Priya Sharma',
            date: '2024-01-26'
          }
        ]
      },
      {
        id: 28,
        brand: 'Samsung',
        model: 'Galaxy M14 5G',
        description: 'Entry-level 5G phone',
        price: 14999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2303/gallery/in-galaxy-m14-5g-m146-sm-m146bzadins-thumb-537371344',
        category: 'budget',
        specs: {
          display: '6.6" PLS LCD',
          processor: 'Exynos 1330',
          ram: '6GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '6000mAh'
        },
        availableColors: ['Smoky Teal', 'Berry Blue', 'Icy Silver'],
        availableRAM: ['4GB', '6GB'],
        availableStorage: ['64GB', '128GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good budget 5G phone with great battery life!',
            author: 'Rahul Kumar',
            date: '2024-01-27'
          }
        ]
      },
      {
        id: 29,
        brand: 'Samsung',
        model: 'Galaxy F14 5G',
        description: 'Basic 5G phone with good battery',
        price: 12999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2303/gallery/in-galaxy-f14-5g-f146-sm-f146bzadins-thumb-537371344',
        category: 'budget',
        specs: {
          display: '6.6" PLS LCD',
          processor: 'Exynos 1330',
          ram: '4GB',
          storage: '128GB',
          camera: '50MP Dual Camera',
          battery: '6000mAh'
        },
        availableColors: ['Electric Black', 'Mystic Green', 'Orchid Purple'],
        availableRAM: ['4GB', '6GB'],
        availableStorage: ['64GB', '128GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great budget 5G phone with amazing battery life!',
            author: 'Amit Kumar',
            date: '2024-01-28'
          }
        ]
      },
      {
        id: 30,
        brand: 'Samsung',
        model: 'Galaxy A14 5G',
        description: 'Entry-level 5G phone',
        price: 11999,
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/in/2301/gallery/in-galaxy-a14-5g-a146-sm-a146bzadins-thumb-537371344',
        category: 'budget',
        specs: {
          display: '6.6" PLS LCD',
          processor: 'Dimensity 700',
          ram: '6GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '5000mAh'
        },
        availableColors: ['Awesome Black', 'Awesome Silver', 'Awesome Light Green'],
        availableRAM: ['4GB', '6GB'],
        availableStorage: ['64GB', '128GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good entry-level 5G phone with decent performance!',
            author: 'Priya Sharma',
            date: '2024-01-29'
          }
        ]
      },
      {
        id: 130,
        brand: 'Vivo',
        model: 'Y56',
        description: 'Entry-level phone with good features',
        price: 149 * 83, // Converted from $149 to ₹12,367
        imageUrl: 'https://www.vivo.com/in/products/y56',
        category: 'budget',
        specs: {
          display: '6.38" AMOLED',
          processor: 'Snapdragon 680',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Dual Camera',
          battery: '5000mAh'
        },
        availableColors: ['Midnight Black', 'Sunset Gold', 'Ocean Blue'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good value for money with decent features!',
            author: 'Amit Kumar',
            date: '2024-02-10'
          }
        ]
      },
      // Oppo Devices (15 variants)
      {
        id: 131,
        brand: 'Oppo',
        model: 'Find X6 Pro',
        description: 'Flagship with Hasselblad cameras',
        price: 1099 * 83, // Converted from $1099 to ₹91,217
        imageUrl: 'https://www.oppo.com/in/products/find-x6-pro',
        category: 'premium',
        specs: {
          display: '6.82" LTPO AMOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '5000mAh'
        },
        availableColors: ['Gloss Black', 'Gloss Gold', 'Gloss Green'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB', '1TB'],
        reviews: [
          {
            rating: 5,
            comment: 'Amazing camera with Hasselblad optics!',
            author: 'David Lee',
            date: '2024-02-11'
          }
        ]
      },
      {
        id: 132,
        brand: 'Oppo',
        model: 'Find N2 Flip',
        description: 'Foldable phone with unique design',
        price: 899 * 83, // Converted from $899 to ₹74,617
        imageUrl: 'https://www.oppo.com/in/products/find-n2-flip',
        category: 'premium',
        specs: {
          display: '6.8" LTPO AMOLED',
          processor: 'Snapdragon 8+ Gen 1',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Dual Camera',
          battery: '4300mAh'
        },
        availableColors: ['Black', 'Purple', 'Gold'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Amazing foldable phone with great design!',
            author: 'Sarah Chen',
            date: '2024-02-12'
          }
        ]
      },
      {
        id: 136,
        brand: 'Oppo',
        model: 'F23 5G',
        description: 'Budget 5G phone with good features',
        price: 299 * 83, // Converted from $299 to ₹24,817
        imageUrl: 'https://www.oppo.com/in/products/f23-5g',
        category: 'budget',
        specs: {
          display: '6.72" LCD',
          processor: 'Snapdragon 695',
          ram: '8GB',
          storage: '256GB',
          camera: '64MP Triple Camera',
          battery: '5000mAh'
        },
        availableColors: ['Cool Black', 'Bubble Gold', 'Ocean Blue'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good 5G phone at affordable price!',
            author: 'Neha Gupta',
            date: '2024-02-16'
          }
        ]
      },
      {
        id: 137,
        brand: 'Oppo',
        model: 'Reno 10 Pro+',
        description: 'Premium mid-range with great camera',
        price: 599 * 83, // Converted from $599 to ₹49,717
        imageUrl: 'https://www.oppo.com/in/products/reno-10-pro-plus',
        category: 'mid-range',
        specs: {
          display: '6.7" AMOLED',
          processor: 'Snapdragon 8+ Gen 1',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4700mAh'
        },
        availableColors: ['Gloss Black', 'Gloss Gold', 'Gloss Purple'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great camera and premium design!',
            author: 'Rahul Sharma',
            date: '2024-02-13'
          }
        ]
      },
      {
        id: 138,
        brand: 'Oppo',
        model: 'Reno 10 Pro',
        description: 'Mid-range phone with good camera',
        price: 599 * 83, // Converted from $599 to ₹49,717
        imageUrl: 'https://www.oppo.com/en/smartphones/series-reno/reno10-pro/',
        category: 'mid-range',
        specs: {
          display: '6.7" AMOLED',
          processor: 'Dimensity 8200',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4600mAh'
        },
        availableColors: ['Gloss Black', 'Gloss Gold', 'Gloss Blue'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great camera and performance!',
            author: 'Priya Patel',
            date: '2024-02-14'
          }
        ]
      },
      {
        id: 139,
        brand: 'Oppo',
        model: 'Reno 10',
        description: 'Affordable mid-range phone',
        price: 399 * 83, // Converted from $399 to ₹33,117
        imageUrl: 'https://www.oppo.com/in/products/reno-10',
        category: 'mid-range',
        specs: {
          display: '6.7" AMOLED',
          processor: 'Dimensity 7050',
          ram: '8GB',
          storage: '256GB',
          camera: '64MP Triple Camera',
          battery: '4600mAh'
        },
        availableColors: ['Gloss Black', 'Gloss Gold', 'Gloss Blue'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good value for money with nice design!',
            author: 'Amit Singh',
            date: '2024-02-15'
          }
        ]
      },
      {
        id: 140,
        brand: 'Oppo',
        model: 'F23 5G',
        description: 'Budget 5G phone with good specs',
        price: 399 * 83, // Converted from $399 to ₹33,117
        imageUrl: 'https://www.oppo.com/in/smartphones/series-f/f23-5g/',
        category: 'budget',
        specs: {
          display: '6.72" AMOLED',
          processor: 'Snapdragon 695',
          ram: '8GB',
          storage: '256GB',
          camera: '64MP Triple Camera',
          battery: '5000mAh'
        },
        availableColors: ['Cool Black', 'Bubble Gold', 'Ocean Blue'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good 5G phone at affordable price!',
            author: 'Neha Gupta',
            date: '2024-02-16'
          }
        ]
      },
      {
        id: 141,
        brand: 'Oppo',
        model: 'F21s Pro',
        description: 'Budget phone with good camera',
        price: 249 * 83, // Converted from $249 to ₹20,667
        imageUrl: 'https://www.oppo.com/in/products/f21s-pro',
        category: 'budget',
        specs: {
          display: '6.43" AMOLED',
          processor: 'Snapdragon 680',
          ram: '8GB',
          storage: '128GB',
          camera: '64MP Triple Camera',
          battery: '4500mAh'
        },
        availableColors: ['Sunset Orange', 'Starry Black', 'Rainbow Spectrum'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great camera for the price!',
            author: 'Rajesh Kumar',
            date: '2024-02-17'
          }
        ]
      },
      {
        id: 142,
        brand: 'Oppo',
        model: 'A78 5G',
        description: 'Budget 5G phone with good battery',
        price: 199 * 83, // Converted from $199 to ₹16,517
        imageUrl: 'https://www.oppo.com/in/products/a78-5g',
        category: 'budget',
        specs: {
          display: '6.56" LCD',
          processor: 'Dimensity 700',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Dual Camera',
          battery: '5000mAh'
        },
        availableColors: ['Glowing Black', 'Glowing Purple'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good battery life and 5G support!',
            author: 'Priya Sharma',
            date: '2024-02-18'
          }
        ]
      },
      {
        id: 143,
        brand: 'Oppo',
        model: 'A58',
        description: 'Budget phone with good features',
        price: 149 * 83, // Converted from $149 to ₹12,367
        imageUrl: 'https://www.oppo.com/in/products/a58',
        category: 'budget',
        specs: {
          display: '6.56" LCD',
          processor: 'Dimensity 700',
          ram: '6GB',
          storage: '128GB',
          camera: '50MP Dual Camera',
          battery: '5000mAh'
        },
        availableColors: ['Glowing Black', 'Glowing Purple'],
        availableRAM: ['6GB', '8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good value for money!',
            author: 'Amit Kumar',
            date: '2024-02-19'
          }
        ]
      },
      {
        id: 144,
        brand: 'Oppo',
        model: 'A38',
        description: 'Entry-level phone with good battery',
        price: 129 * 83, // Converted from $129 to ₹10,707
        imageUrl: 'https://www.oppo.com/in/products/a38',
        category: 'budget',
        specs: {
          display: '6.56" LCD',
          processor: 'Helio G85',
          ram: '4GB',
          storage: '64GB',
          camera: '50MP Dual Camera',
          battery: '5000mAh'
        },
        availableColors: ['Glowing Black', 'Glowing Purple'],
        availableRAM: ['4GB', '6GB'],
        availableStorage: ['64GB', '128GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good battery life for the price!',
            author: 'Neha Gupta',
            date: '2024-02-20'
          }
        ]
      },
      {
        id: 145,
        brand: 'Oppo',
        model: 'A18',
        description: 'Entry-level phone with good features',
        price: 99 * 83, // Converted from $99 to ₹8,217
        imageUrl: 'https://www.oppo.com/in/products/a18',
        category: 'budget',
        specs: {
          display: '6.56" LCD',
          processor: 'Helio G85',
          ram: '4GB',
          storage: '64GB',
          camera: '50MP Dual Camera',
          battery: '5000mAh'
        },
        availableColors: ['Glowing Black', 'Glowing Purple'],
        availableRAM: ['4GB', '6GB'],
        availableStorage: ['64GB', '128GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Good entry-level phone with decent features!',
            author: 'Rahul Verma',
            date: '2024-02-21'
          }
        ]
      },
      // Google
      {
        id: 163,
        brand: 'Google',
        model: 'Pixel 8 Pro',
        description: 'Google\'s flagship with AI features',
        price: 899 * 83, // Converted from $899 to ₹74,617
        imageUrl: 'https://store.google.com/product/pixel_8_pro',
        category: 'premium',
        specs: {
          display: '6.7" LTPO OLED',
          processor: 'Google Tensor G3',
          ram: '12GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '5050mAh'
        },
        availableColors: ['Obsidian', 'Porcelain', 'Bay'],
        availableRAM: ['12GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Best Android phone with amazing camera',
            author: 'Rahul Verma',
            date: '2024-02-15'
          }
        ]
      },
      {
        id: 164,
        brand: 'Google',
        model: 'Pixel 8',
        description: 'Compact flagship with AI features',
        price: 699 * 83, // Converted from $699 to ₹58,017
        imageUrl: 'https://store.google.com/product/pixel_8',
        category: 'premium',
        specs: {
          display: '6.2" OLED',
          processor: 'Google Tensor G3',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Dual Camera',
          battery: '4575mAh'
        },
        availableColors: ['Obsidian', 'Hazel', 'Rose'],
        availableRAM: ['8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great compact phone with excellent camera',
            author: 'Priya Patel',
            date: '2024-02-16'
          }
        ]
      },
      {
        id: 165,
        brand: 'Google',
        model: 'Pixel 7a',
        description: 'Affordable Pixel with great features',
        price: 449 * 83, // Converted from $449 to ₹37,267
        imageUrl: 'https://store.google.com/product/pixel_7a',
        category: 'mid-range',
        specs: {
          display: '6.1" OLED',
          processor: 'Google Tensor G2',
          ram: '8GB',
          storage: '128GB',
          camera: '64MP Dual Camera',
          battery: '4385mAh'
        },
        availableColors: ['Charcoal', 'Sea', 'Coral'],
        availableRAM: ['8GB'],
        availableStorage: ['128GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Best mid-range phone with Pixel features',
            author: 'Amit Kumar',
            date: '2024-02-17'
          }
        ]
      },

      // Xiaomi
      {
        id: 146,
        brand: 'Xiaomi',
        model: '13 Ultra',
        description: 'Photography-focused flagship',
        price: 66317,
        imageUrl: 'https://i02.appmifile.com/897_operator_sg/10/05/2023/ce8cd8a176f27317dfb3c419c7c0ecd8.png',
        category: 'premium',
        specs: {
          display: '6.73" AMOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Quad Camera',
          battery: '5000mAh'
        },
        availableColors: ['Black', 'White', 'Green'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Incredible camera system',
            author: 'Sneha Sharma',
            date: '2024-02-18'
          }
        ]
      },
      {
        id: 147,
        brand: 'Xiaomi',
        model: '13 Pro',
        description: 'Premium flagship with Leica optics',
        price: 58017,
        imageUrl: 'https://i02.appmifile.com/285_operator_sg/10/05/2023/0e32b71d5a6bc2b7d659f50c6bf9f92f.png',
        category: 'premium',
        specs: {
          display: '6.73" AMOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4820mAh'
        },
        availableColors: ['Black', 'White', 'Green'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB', '512GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great value for money flagship',
            author: 'Rohan Mehta',
            date: '2024-02-19'
          }
        ]
      },
      {
        id: 148,
        brand: 'Xiaomi',
        model: '13',
        description: 'Compact flagship with great features',
        price: 49717,
        imageUrl: 'https://i02.appmifile.com/604_operator_sg/10/05/2023/c5467e3b7bb87e15e25ef2a0b3a3cdc7.png',
        category: 'premium',
        specs: {
          display: '6.36" AMOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '4500mAh'
        },
        availableColors: ['Black', 'White', 'Green'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Perfect size with flagship features',
            author: 'Ananya Singh',
            date: '2024-02-20'
          }
        ]
      },

      // OnePlus
      {
        id: 149,
        brand: 'OnePlus',
        model: '12',
        description: 'Flagship killer with Hasselblad camera',
        price: 66317,
        imageUrl: 'https://image01.oneplus.net/ebp/202401/19/1-m00-55-01-cpgm7mwkqfkaoxlpaakxhqww_uw148.png',
        category: 'premium',
        specs: {
          display: '6.82" LTPO AMOLED',
          processor: 'Snapdragon 8 Gen 3',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '5400mAh'
        },
        availableColors: ['Flowy Emerald', 'Silky Black'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Best OnePlus phone ever',
            author: 'Vikram Singh',
            date: '2024-02-21'
          }
        ]
      },
      {
        id: 150,
        brand: 'OnePlus',
        model: '12R',
        description: 'Premium mid-range with flagship features',
        price: 49717,
        imageUrl: 'https://image01.oneplus.net/ebp/202401/19/1-m00-55-01-cpgm7mwkqfyafd7taajhxqcqtj4901.png',
        category: 'mid-range',
        specs: {
          display: '6.78" AMOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '5500mAh'
        },
        availableColors: ['Iron Gray', 'Cool Blue'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great value for money',
            author: 'Neha Gupta',
            date: '2024-02-22'
          }
        ]
      },
      {
        id: 151,
        brand: 'OnePlus',
        model: 'Nord 3',
        description: 'Mid-range with premium features',
        price: 33117,
        imageUrl: 'https://image01.oneplus.net/ebp/202307/06/1-m00-51-00-rb8bwmsnbkeadqjfaahvdxcqnqm141.png',
        category: 'mid-range',
        specs: {
          display: '6.74" AMOLED',
          processor: 'Dimensity 9000',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Triple Camera',
          battery: '5000mAh'
        },
        availableColors: ['Misty Green', 'Tempest Gray'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Best mid-range phone',
            author: 'Arjun Patel',
            date: '2024-02-23'
          }
        ]
      },

      // Vivo
      {
        id: 152,
        brand: 'Vivo',
        model: 'X100 Pro',
        description: 'Photography-focused flagship',
        price: 66317,
        imageUrl: 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1701331496240/b4f6d4c6c4a5f8f2c0f2e6e5e3c8f6e5.png',
        category: 'premium',
        specs: {
          display: '6.78" AMOLED',
          processor: 'Dimensity 9300',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '5400mAh'
        },
        availableColors: ['Starry Black', 'Sunset Orange'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Amazing camera system',
            author: 'Priyanka Sharma',
            date: '2024-02-24'
          }
        ]
      },
      {
        id: 153,
        brand: 'Vivo',
        model: 'V29 Pro',
        description: 'Style-focused mid-range',
        price: 41417,
        imageUrl: 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1695890455241/2d1f1c7f3e0a3c1d5b4a2e1d3c5b4a3c.png',
        category: 'mid-range',
        specs: {
          display: '6.78" AMOLED',
          processor: 'Dimensity 8200',
          ram: '8GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4600mAh'
        },
        availableColors: ['Himalayan Blue', 'Space Black'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great design and camera',
            author: 'Rahul Verma',
            date: '2024-02-25'
          }
        ]
      },
      {
        id: 154,
        brand: 'Vivo',
        model: 'T2 Pro',
        description: 'Performance-focused mid-range',
        price: 24817,
        imageUrl: 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1694673455236/3e2d1c7f4b5a6e8d9c0f2e1d3c5b4a7f.png',
        category: 'mid-range',
        specs: {
          display: '6.78" AMOLED',
          processor: 'Dimensity 7200',
          ram: '8GB',
          storage: '128GB',
          camera: '64MP Dual Camera',
          battery: '4600mAh'
        },
        availableColors: ['New Black', 'Dune Gold'],
        availableRAM: ['8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great performance for the price',
            author: 'Ananya Singh',
            date: '2024-02-26'
          }
        ]
      },

      // Motorola
      {
        id: 155,
        brand: 'Motorola',
        model: 'Edge 40 Pro',
        description: 'Flagship with clean Android',
        price: 58017,
        imageUrl: 'https://motorolain.vtexassets.com/arquivos/ids/157508-1200-auto',
        category: 'premium',
        specs: {
          display: '6.67" pOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '4600mAh'
        },
        availableColors: ['Black', 'Blue'],
        availableRAM: ['12GB'],
        availableStorage: ['256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Clean Android experience',
            author: 'Vikram Singh',
            date: '2024-02-27'
          }
        ]
      },
      {
        id: 156,
        brand: 'Motorola',
        model: 'Edge 40',
        description: 'Premium mid-range with great design',
        price: 41417,
        imageUrl: 'https://motorolain.vtexassets.com/arquivos/ids/157404-1200-auto',
        category: 'mid-range',
        specs: {
          display: '6.55" pOLED',
          processor: 'Dimensity 8020',
          ram: '8GB',
          storage: '256GB',
          camera: '50MP Dual Camera',
          battery: '4400mAh'
        },
        availableColors: ['Black', 'Blue', 'Green'],
        availableRAM: ['8GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great design and performance',
            author: 'Neha Gupta',
            date: '2024-02-28'
          }
        ]
      },
      {
        id: 157,
        brand: 'Motorola',
        model: 'G84',
        description: 'Budget phone with premium features',
        price: 20667,
        imageUrl: 'https://motorolain.vtexassets.com/arquivos/ids/157804-1200-auto',
        category: 'budget',
        specs: {
          display: '6.5" pOLED',
          processor: 'Snapdragon 695',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Dual Camera',
          battery: '5000mAh'
        },
        availableColors: ['Marshmallow Blue', 'Midnight Blue'],
        availableRAM: ['12GB'],
        availableStorage: ['256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great value for money',
            author: 'Arjun Patel',
            date: '2024-02-29'
          }
        ]
      },

      // Asus
      {
        id: 158,
        brand: 'Asus',
        model: 'ROG Phone 8 Pro',
        description: 'Ultimate gaming phone',
        price: 82917,
        imageUrl: 'https://dlcdnwebimgs.asus.com/gain/E06E5DC3-B315-4F5E-9D5E-5C7B2C9D6BBD',
        category: 'premium',
        specs: {
          display: '6.78" AMOLED',
          processor: 'Snapdragon 8 Gen 3',
          ram: '16GB',
          storage: '512GB',
          camera: '50MP Triple Camera',
          battery: '6000mAh'
        },
        availableColors: ['Phantom Black'],
        availableRAM: ['16GB'],
        availableStorage: ['512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Best gaming phone ever',
            author: 'Rahul Verma',
            date: '2024-03-01'
          }
        ]
      },
      {
        id: 159,
        brand: 'Asus',
        model: 'Zenfone 10',
        description: 'Compact flagship',
        price: 58017,
        imageUrl: 'https://dlcdnwebimgs.asus.com/gain/D7DDEF0D-D310-4D4E-8842-179570E0A665',
        category: 'premium',
        specs: {
          display: '5.9" AMOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Dual Camera',
          battery: '4300mAh'
        },
        availableColors: ['Black', 'White', 'Green'],
        availableRAM: ['8GB', '16GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Perfect compact phone',
            author: 'Priyanka Sharma',
            date: '2024-03-02'
          }
        ]
      },
      {
        id: 160,
        brand: 'Asus',
        model: 'ROG Phone 7',
        description: 'Previous gen gaming phone',
        price: 66317,
        imageUrl: 'https://dlcdnwebimgs.asus.com/gain/C22E2177-4C67-4E6B-A0CB-E6CAEF7DBE8B',
        category: 'premium',
        specs: {
          display: '6.78" AMOLED',
          processor: 'Snapdragon 8 Gen 2',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Triple Camera',
          battery: '6000mAh'
        },
        availableColors: ['Phantom Black'],
        availableRAM: ['12GB', '16GB'],
        availableStorage: ['256GB', '512GB'],
        reviews: [
          {
            rating: 5,
            comment: 'Amazing gaming performance',
            author: 'Vikram Singh',
            date: '2024-03-03'
          }
        ]
      },

      // Nothing
      {
        id: 161,
        brand: 'Nothing',
        model: 'Phone 2',
        description: 'Unique design with great features',
        price: 49717,
        imageUrl: 'https://image.nothing.tech/cms/2023-07/Phone-2-Dark-Grey-Front.png',
        category: 'premium',
        specs: {
          display: '6.7" LTPO OLED',
          processor: 'Snapdragon 8+ Gen 1',
          ram: '12GB',
          storage: '256GB',
          camera: '50MP Dual Camera',
          battery: '4700mAh'
        },
        availableColors: ['White', 'Dark Gray'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Unique design and great performance',
            author: 'Ananya Singh',
            date: '2024-03-04'
          }
        ]
      },
      {
        id: 162,
        brand: 'Nothing',
        model: 'Phone 1',
        description: 'First phone with unique design',
        price: 33117,
        imageUrl: 'https://image.nothing.tech/cms/2022-09/Phone-1-Black-Front.png',
        category: 'mid-range',
        specs: {
          display: '6.55" OLED',
          processor: 'Snapdragon 778G+',
          ram: '8GB',
          storage: '128GB',
          camera: '50MP Dual Camera',
          battery: '4500mAh'
        },
        availableColors: ['White', 'Black'],
        availableRAM: ['8GB', '12GB'],
        availableStorage: ['128GB', '256GB'],
        reviews: [
          {
            rating: 4,
            comment: 'Great first attempt',
            author: 'Arjun Patel',
            date: '2024-03-05'
          }
        ]
      }
    ];

    this.cart = this.cartService.getCart();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async handleLogin(email: string, password: string) {
    this.isLoading = true;
    this.loginError = '';
    
    try {
      const response = await this.authService.login(email, password);
      if (response.success) {
        this.closeAuthModals();
      } else {
        this.loginError = response.message || 'Login failed';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.loginError = 'An unexpected error occurred';
    } finally {
      this.isLoading = false;
    }
  }

  showMobileDetails(mobile: Mobile): void {
    this.selectedMobile = { ...mobile };
    this.selectedMobile.selectedColor = mobile.availableColors[0];
    this.selectedMobile.selectedRAM = mobile.availableRAM[0];
    this.selectedMobile.selectedStorage = mobile.availableStorage[0];
    this.showDetails = true;
  }

  closeDetails(): void {
    this.selectedMobile = null;
    this.showDetails = false;
  }

  updatePrice(): void {
    if (this.selectedMobile) {
      const basePrice = this.selectedMobile.price;
      const storageMultiplier = this.selectedMobile.selectedStorage === '512GB' ? 1.2 : 
                              this.selectedMobile.selectedStorage === '1TB' ? 1.4 : 1;
      const ramMultiplier = this.selectedMobile.selectedRAM === '12GB' ? 1.1 : 1;
      this.selectedMobile.price = Math.round(basePrice * storageMultiplier * ramMultiplier);
    }
  }

  addReview(): void {
    if (this.selectedMobile && this.newReview.comment && this.newReview.author) {
      this.selectedMobile.reviews.push({...this.newReview});
      this.newReview = {
        rating: 5,
        comment: '',
        author: '',
        date: new Date().toISOString().split('T')[0]
      };
    }
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-natural-titanium-select-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009283816';
    imgElement.onerror = null; // Prevent infinite loop
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    } else {
      return url;
    }
  }

  get filteredMobiles(): Mobile[] {
    let filtered = this.mobiles;
    
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(mobile => mobile.category === this.selectedCategory);
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(mobile => 
        mobile.brand.toLowerCase().includes(query) ||
        mobile.model.toLowerCase().includes(query) ||
        mobile.description.toLowerCase().includes(query) ||
        mobile.specs.processor.toLowerCase().includes(query) ||
        mobile.specs.ram.toLowerCase().includes(query) ||
        mobile.specs.storage.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  getMobilesByBrand(brand: string): Mobile[] {
    return this.filteredMobiles.filter(mobile => 
      mobile.brand === brand && 
      (this.selectedCategory === 'all' || mobile.category === this.selectedCategory)
    );
  }

  addToCart(mobile: Mobile) {
    // Create a copy of the mobile with selected options
    const cartItem = {
      ...mobile,
      selectedColor: mobile.selectedColor || mobile.availableColors[0],
      selectedRAM: mobile.selectedRAM || mobile.availableRAM[0],
      selectedStorage: mobile.selectedStorage || mobile.availableStorage[0]
    };
    
    this.cartService.addToCart(cartItem);
    this.cart = this.cartService.getCart();
  }

  isInCart(mobile: Mobile): boolean {
    if (!mobile) return false;
    
    const selectedColor = mobile.selectedColor || mobile.availableColors[0];
    const selectedRAM = mobile.selectedRAM || mobile.availableRAM[0];
    const selectedStorage = mobile.selectedStorage || mobile.availableStorage[0];
    
    return this.cart.some(item => 
      item.id === mobile.id && 
      item.selectedColor === selectedColor &&
      item.selectedRAM === selectedRAM &&
      item.selectedStorage === selectedStorage
    );
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }

  clearSearch(): void {
    this.searchQuery = '';
  }

  toggleLoginDropdown() {
    this.showLoginDropdown = !this.showLoginDropdown;
  }

  openLoginModal() {
    this.showLoginDropdown = false;
    this.showLoginModal = true;
  }

  openSignupModal() {
    this.showLoginDropdown = false;
    this.showSignupModal = true;
  }

  openForgotPasswordModal() {
    this.showLoginDropdown = false;
    this.showForgotPasswordModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.loginEmail = '';
    this.loginPassword = '';
    this.emailError = '';
    this.passwordError = '';
    this.authError = '';
  }

  closeSignupModal() {
    this.showSignupModal = false;
  }

  closeForgotPasswordModal(): void {
    this.showForgotPasswordModal = false;
    this.resetPasswordSuccess = false;
    this.forgotPasswordEmail = '';
    this.forgotPasswordEmailError = '';
  }

  switchToLogin() {
    this.closeSignupModal();
    this.openLoginModal();
  }

  validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      this.emailError = 'Email is required';
    } else if (!emailRegex.test(email)) {
      this.emailError = 'Please enter a valid email address';
    } else {
      this.emailError = '';
    }
  }

  validatePassword(password: string): void {
    this.passwordRequirements = {
      length: password.length >= 8,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /[0-9]/.test(password),
      capitalLetter: /[A-Z]/.test(password)
    };

    if (!password) {
      this.passwordError = 'Password is required';
    } else if (!this.passwordRequirements.length || 
               !this.passwordRequirements.specialChar || 
               !this.passwordRequirements.number || 
               !this.passwordRequirements.capitalLetter) {
      this.passwordError = 'Password does not meet requirements';
    } else {
      this.passwordError = '';
    }
  }

  onEmailChange(value: string): void {
    this.loginEmail = value;
    this.validateEmail(value);
  }

  onPasswordChange(value: string): void {
    this.loginPassword = value;
    this.validatePassword(value);
  }

  async login() {
    try {
      if (!this.loginEmail || !this.loginPassword) {
        this.emailError = !this.loginEmail ? 'Email is required' : '';
        this.passwordError = !this.loginPassword ? 'Password is required' : '';
        return;
      }

      const response = await this.authService.login(this.loginEmail, this.loginPassword);
      if (response.success && response.user) {
        this.currentUser = response.user;
        this.showSuccessMessage(`Welcome back, ${response.user.name}!`);
        this.closeLoginModal();
        this.showLoginDropdown = false;
      } else {
        this.showErrorMessage(response.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showErrorMessage('An error occurred during login. Please try again.');
    }
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
  }

  onSignupEmailChange(value: string): void {
    this.signupEmail = value;
    this.validateSignupEmail(value);
  }

  onSignupPasswordChange(value: string): void {
    this.signupPassword = value;
    this.validateSignupPassword(value);
    this.validateConfirmPassword();
  }

  onConfirmPasswordChange(value: string): void {
    this.signupConfirmPassword = value;
    this.validateConfirmPassword();
  }

  validateSignupEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      this.signupEmailError = 'Email is required';
    } else if (!emailRegex.test(email)) {
      this.signupEmailError = 'Please enter a valid email address';
    } else {
      this.signupEmailError = '';
    }
  }

  validateSignupPassword(password: string): void {
    this.signupPasswordRequirements = {
      length: password.length >= 8,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      number: /[0-9]/.test(password),
      capitalLetter: /[A-Z]/.test(password)
    };

    if (!password) {
      this.signupPasswordError = 'Password is required';
    } else if (!this.signupPasswordRequirements.length || 
               !this.signupPasswordRequirements.specialChar || 
               !this.signupPasswordRequirements.number || 
               !this.signupPasswordRequirements.capitalLetter) {
      this.signupPasswordError = 'Password does not meet requirements';
    } else {
      this.signupPasswordError = '';
    }
  }

  validateConfirmPassword(): void {
    if (!this.signupConfirmPassword) {
      this.signupConfirmPasswordError = 'Please confirm your password';
    } else if (this.signupPassword !== this.signupConfirmPassword) {
      this.signupConfirmPasswordError = 'Passwords do not match';
    } else {
      this.signupConfirmPasswordError = '';
    }
  }

  async signup() {
    try {
      if (!this.validateSignupForm()) {
        return;
      }

      // Clear any previous error
      this.authError = '';

      const signupData = {
        name: this.signupName.trim(),
        email: this.signupEmail.trim(),
        password: this.signupPassword,
        phone: this.signupPhone.trim()
      };

      const response = await this.authService.signup(signupData);
      
      if (response.success) {
        this.showSuccessMessage('Account created successfully!');
        this.closeSignupModal();
        this.showLoginDropdown = false;
      } else {
        this.showErrorMessage(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      this.showErrorMessage('An error occurred during signup. Please try again.');
    }
  }

  private validateSignupForm(): boolean {
    // Reset error messages
    this.authError = '';
    
    // Trim whitespace from inputs
    this.signupName = this.signupName?.trim();
    this.signupEmail = this.signupEmail?.trim();
    this.signupPhone = this.signupPhone?.trim();
    
    // Check for empty fields
    if (!this.signupName) {
      this.showErrorMessage('Please enter your name');
      return false;
    }
    
    if (!this.signupEmail) {
      this.showErrorMessage('Please enter your email');
      return false;
    }
    
    if (!this.signupPhone) {
      this.showErrorMessage('Please enter your phone number');
      return false;
    }
    
    if (!this.signupPassword) {
      this.showErrorMessage('Please enter a password');
      return false;
    }
    
    if (!this.signupConfirmPassword) {
      this.showErrorMessage('Please confirm your password');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signupEmail)) {
      this.showErrorMessage('Please enter a valid email address');
      return false;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(this.signupPhone)) {
      this.showErrorMessage('Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate password requirements
    if (!this.signupPasswordRequirements.length || 
        !this.signupPasswordRequirements.specialChar || 
        !this.signupPasswordRequirements.number || 
        !this.signupPasswordRequirements.capitalLetter) {
      this.showErrorMessage('Password does not meet all requirements');
      return false;
    }

    // Check if passwords match
    if (this.signupPassword !== this.signupConfirmPassword) {
      this.showErrorMessage('Passwords do not match');
      return false;
    }

    return true;
  }

  onForgotPasswordEmailChange(value: string): void {
    this.forgotPasswordEmail = value;
    this.validateForgotPasswordEmail(value);
  }

  validateForgotPasswordEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      this.forgotPasswordEmailError = 'Email is required';
    } else if (!emailRegex.test(email)) {
      this.forgotPasswordEmailError = 'Please enter a valid email address';
    } else {
      this.forgotPasswordEmailError = '';
    }
  }

  resetPassword(): void {
    this.validateForgotPasswordEmail(this.forgotPasswordEmail);
    
    if (!this.forgotPasswordEmailError) {
      if (this.forgotPasswordEmail.trim() === '') {
        this.showErrorMessage('Please enter your email address');
        return;
      }
      
      if (this.forgotPasswordEmail === 'user@example.com') {
        this.showSuccessMessage('Password reset instructions have been sent to your email address.');
        this.resetPasswordSuccess = true;
        this.closeForgotPasswordModal();
        this.showLoginDropdown = false;
      } else {
        this.showErrorMessage('No account found with this email address. Please create a new account.');
      }
    } else {
      this.showErrorMessage('Please enter a valid email address.');
    }
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

  showSuccessMessage(message: string) {
    this.messageText = message;
    this.messageType = 'success';
    this.showMessage = true;
    setTimeout(() => this.closeMessage(), 2000);
  }

  showErrorMessage(message: string) {
    this.messageText = message;
    this.messageType = 'error';
    this.showMessage = true;
  }

  private closeAuthModals() {
    this.showLoginModal = false;
    this.showSignupModal = false;
    this.showForgotPasswordModal = false;
    this.showLoginDropdown = false;
  }
} 