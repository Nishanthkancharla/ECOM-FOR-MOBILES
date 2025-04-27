import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="deals-container">
      <h1>Special Deals</h1>
      <div class="deals-grid">
        <!-- Deals content will go here -->
        <p>Coming soon: Amazing deals on mobile phones!</p>
      </div>
    </div>
  `,
  styles: [`
    .deals-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .deals-grid {
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
export class DealsComponent {
  constructor() {}
} 