import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('./features/home/home-module').then((m) => m.HomeModule),
      },
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'cart',
        loadChildren: () => import('./features/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'checkout',
        loadChildren: () => import('./features/checkout/checkout.module').then((m) => m.CheckoutModule),
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [authGuard]
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
