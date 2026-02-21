import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category } from '../../../data/models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  flashSales$!: Observable<Product[]>;
  categories$!: Observable<Category[]>;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.flashSales$ = this.productService.getFlashSales();
    this.categories$ = this.productService.getCategories();
  }
}
