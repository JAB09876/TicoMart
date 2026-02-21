import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of, delay, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, LoginRequest, RegisterRequest, UpdateProfileRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api'; // Mock API URL

  // Using Signals for state management
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock login - in a real app this would hit the API
    const mockUser: User = {
      id: 15,
      username: credentials.username,
      email: 'user@ticomart.com',
      firstName: 'Tico',
      lastName: 'User',
      phone: '+506 8888-8888',
      image: 'https://robohash.org/tico?set=set4',
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      token: 'fake-jwt-token-' + Date.now()
    };

    const response: AuthResponse = {
      user: mockUser,
      token: mockUser.token!,
      message: 'Login successful'
    };

    return of(response).pipe(
      delay(800), // Simulate network delay
      tap(response => {
        this.setUser(response.user);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Mock registration
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '+506 8888-8888',
      image: 'https://robohash.org/' + userData.username + '?set=set4',
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      token: 'fake-jwt-token-' + Date.now()
    };

    const response: AuthResponse = {
      user: mockUser,
      token: mockUser.token!,
      message: 'Registration successful'
    };

    return of(response).pipe(
      delay(800),
      tap(response => {
        this.setUser(response.user);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('ticomart_user');
      localStorage.removeItem('ticomart_token');
    }
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<User> {
    const currentUser = this.currentUserSignal();
    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }

    const updatedUser: User = {
      ...currentUser,
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    return of(updatedUser).pipe(
      delay(500),
      tap(user => {
        this.setUser(user);
      })
    );
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('ticomart_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn() && !!this.getToken();
  }

  private setUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('ticomart_user', JSON.stringify(user));
      localStorage.setItem('ticomart_token', user.token || '');
    }
    this.currentUserSignal.set(user);
  }

  private getUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('ticomart_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}

