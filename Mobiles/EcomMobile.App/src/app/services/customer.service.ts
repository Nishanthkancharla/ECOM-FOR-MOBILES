import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly STORAGE_KEY = 'registered_customers';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getStoredCustomers(): User[] {
    if (!this.isBrowser) return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCustomers(customers: User[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
    }
  }

  storeCustomer(customer: User): void {
    const customers = this.getStoredCustomers();
    // Check if customer already exists
    const existingIndex = customers.findIndex(c => c.email === customer.email);
    
    if (existingIndex >= 0) {
      // Update existing customer
      customers[existingIndex] = { ...customers[existingIndex], ...customer };
    } else {
      // Add new customer
      customers.push(customer);
    }
    
    this.saveCustomers(customers);
  }

  findCustomer(email: string, password: string): User | null {
    const customers = this.getStoredCustomers();
    return customers.find(c => c.email === email) || null;
  }

  isEmailRegistered(email: string): boolean {
    const customers = this.getStoredCustomers();
    return customers.some(c => c.email === email);
  }

  updateCustomer(email: string, updates: Partial<User>): boolean {
    const customers = this.getStoredCustomers();
    const index = customers.findIndex(c => c.email === email);
    
    if (index >= 0) {
      customers[index] = { ...customers[index], ...updates };
      this.saveCustomers(customers);
      return true;
    }
    return false;
  }
} 