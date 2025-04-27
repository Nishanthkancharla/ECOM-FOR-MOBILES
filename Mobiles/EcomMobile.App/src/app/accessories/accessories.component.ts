import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="accessories-container">
      <h1>Mobile Accessories</h1>
      <div class="accessories-grid">
        <!-- Accessories content will go here -->
        <p>Coming soon: Browse our collection of mobile accessories!</p>
      </div>
    </div>
  `,
  styles: [`
    .accessories-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .accessories-grid {
      display: grid;
      gap: 20px;
      margin-top: 20px;
    }
    h1 {
      color: var(--text-primary);
      margin-bottom: 20px;
    }
  `]
})
export class AccessoriesComponent {
  constructor() {}
} 