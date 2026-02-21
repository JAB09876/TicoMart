import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product, Category } from '../../../data/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  isLoading = true;
  selectedCategory: string | null = null;
  private searchTerms = new Subject<string>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    // Handle search debouncing
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.productService.searchProducts(term))
    ).subscribe(response => {
       this.products = response.products;
       this.isLoading = false;
    });

    // Check query params for category
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category) {
        this.selectedCategory = category;
        this.filterByCategory(category);
      } else {
        this.selectedCategory = null;
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(30).subscribe({
      next: (res) => {
        this.products = res.products;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  search(term: string): void {
    this.searchQuery = term;
    if (!term.trim()) {
      this.loadProducts();
      return;
    }
    this.isLoading = true;
    this.searchTerms.next(term);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.isLoading = true;
    // Update URL without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category },
      queryParamsHandling: 'merge',
    });

    this.productService.getProductsByCategory(category).subscribe({
      next: (res) => {
        this.products = res.products;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  clearFilter(): void {
    this.selectedCategory = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge',
    });
    this.loadProducts();
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation(); // Prevent navigating to detail
    this.cartService.addToCart(product);
    // Optional: Add toast notification here
  }
}
