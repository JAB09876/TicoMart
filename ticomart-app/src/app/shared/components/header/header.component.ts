import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  get currentUser() {
    return this.authService.currentUser();
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  onProfile(): void {
    this.router.navigate(['/profile']);
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onHome(): void {
    this.router.navigate(['/']);
  }
}
