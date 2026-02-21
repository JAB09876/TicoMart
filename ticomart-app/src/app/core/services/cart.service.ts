import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../data/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private cartItemsSignal = signal<CartItem[]>(this.getCartFromStorage());

  readonly cartItems = this.cartItemsSignal.asReadonly();
  
  readonly cartCount = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );
  
  readonly cartTotal = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  constructor() {
    // Persist cart to local storage whenever it changes
    effect(() => {
      const items = this.cartItemsSignal();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('ticomart_cart', JSON.stringify(items));
      }
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartItemsSignal.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...items, { product, quantity }];
      }
    });
  }

  removeFromCart(productId: number): void {
    this.cartItemsSignal.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.cartItemsSignal.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
  }

  private getCartFromStorage(): CartItem[] {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('ticomart_cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }
}

