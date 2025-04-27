import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';

  // 🔥 FIXED: Changed router from private → public
  constructor(private authService: AuthService, public router: Router) {}

  register() {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.message = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000); // Redirect after 2 seconds
      },
      error: () => {
        this.message = 'Registration failed!';
      }
    });
  }
}
