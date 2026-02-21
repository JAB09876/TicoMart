import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private _formBuilder = inject(FormBuilder);
  private cartService = inject(CartService);
  private router = inject(Router);

  shippingForm = this._formBuilder.group({
    fullName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['', Validators.required]
  });

  paymentForm = this._formBuilder.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
  });

  placeOrder() {
    if (this.shippingForm.valid && this.paymentForm.valid) {
      // Simulate API call
      setTimeout(() => {
        this.cartService.clearCart();
        alert('Order Placed Successfully!');
        this.router.navigate(['/']);
      }, 1000);
    }
  }
}
