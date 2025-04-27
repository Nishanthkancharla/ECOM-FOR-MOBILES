import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();
  private readonly STORAGE_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'authToken';
  private readonly USERS_KEY = 'registered_users';
  private readonly API_URL = 'http://localhost:5001/api';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeAuthState();
  }

  private initializeAuthState() {
    // Initialize from stored data
    const storedUser = this.isBrowser ? this.getStoredUser() : null;
    const storedToken = this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
    
    // Only initialize as logged in if both user and token exist
    const isValidAuth = !!(storedUser && storedToken);
    
    // Initialize the BehaviorSubject
    this.currentUserSubject = new BehaviorSubject<User | null>(
      isValidAuth ? storedUser : null
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Clean up if auth state is invalid
    if (!isValidAuth && (storedUser || storedToken)) {
      this.clearAuthData();
    }
  }

  private getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem(this.STORAGE_KEY);
      if (!storedUser) return null;
      
      const user = JSON.parse(storedUser);
      // Validate user object structure
      if (!user.id || !user.email) {
        throw new Error('Invalid user data');
      }
      return user;
    } catch {
      this.clearAuthData();
      return null;
    }
  }

  private setStoredUser(user: User | null): void {
    if (this.isBrowser) {
      if (user) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        // Generate and store a new token when setting user
        const token = `mock_token_${Date.now()}`;
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        this.clearAuthData();
      }
    }
  }

  private clearAuthData(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
      // Update the BehaviorSubject
      this.currentUserSubject.next(null);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    const user = this.getStoredUser();
    const token = localStorage.getItem(this.TOKEN_KEY);
    const isValid = !!(user && token);
    
    // If stored data is invalid, clear it
    if (!isValid && (user || token)) {
      this.clearAuthData();
    }
    
    return isValid;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
      console.log('Attempting login for email:', email);
      
      // Find user by email
      const user = users.find((u: User) => u.email === email);
      
      // If no user found
      if (!user) {
        console.log('No user found with email:', email);
        return {
          success: false,
          message: 'User does not exist. Please sign up first.'
        };
      }
      
      // Check password
      if (user.password === password) {
        console.log('Login successful for user:', user.email);
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = user;
        // Set user data and generate new token
        this.setStoredUser(userWithoutPassword);
        // Update the BehaviorSubject
        this.currentUserSubject.next(userWithoutPassword);
        return { success: true, user: userWithoutPassword };
      }
      
      console.log('Invalid password for user:', email);
      return {
        success: false,
        message: 'Invalid password. Please try again.'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
      
      if (users.some((u: User) => u.email === data.email)) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password // Store password for validation during login
      };

      users.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      // Remove password before storing in current session
      const { password: _, ...userWithoutPassword } = newUser;
      // Set user data and generate new token
      this.setStoredUser(userWithoutPassword);
      // Update the BehaviorSubject
      this.currentUserSubject.next(userWithoutPassword);

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'An error occurred during signup'
      };
    }
  }

  logout() {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  // Method to check if user is authenticated and redirect if needed
  checkAuthAndRedirect(targetPath: string = '/order-confirmation'): boolean {
    if (!this.isLoggedIn()) {
      if (this.isBrowser) {
        sessionStorage.setItem('redirectUrl', targetPath);
      }
      return false;
    }
    return true;
  }

  // Method to handle post-login/signup redirect
  handleAuthRedirect() {
    if (this.isBrowser) {
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
      sessionStorage.removeItem('redirectUrl');
      this.router.navigate([redirectUrl]);
    }
  }

  public getCurrentStoredUser(): User | null {
    return this.getStoredUser();
  }

  public deleteUsersByEmails(emails: string[]): void {
    if (!this.isBrowser) return;

    try {
      // Get current users
      const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
      
      // Filter out the specified emails
      const filteredUsers = users.filter((user: User) => !emails.includes(user.email));
      
      // Save the filtered users back to localStorage
      localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
      
      // If current user is one of the deleted users, log them out
      const currentUser = this.currentUserValue;
      if (currentUser && emails.includes(currentUser.email)) {
        this.logout();
      }

      console.log('Successfully deleted user data for specified emails');
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  }
}
