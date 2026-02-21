import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private router: Router
  ) {}

  get user() {
    return this.authService.currentUser();
  }

  logout() {
    this.authService.logout();
  }
}
