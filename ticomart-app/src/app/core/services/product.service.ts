import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductResponse, Category } from '../../data/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com';

  constructor(private http: HttpClient) { }

  getProducts(limit: number = 10, skip: number = 0): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products?limit=${limit}&skip=${skip}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  searchProducts(query: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/search?q=${query}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/products/categories`);
  }

  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/category/${category}`);
  }

  // Helper for Flash Sales (just gets some discounted items or random ones)
  getFlashSales(): Observable<Product[]> {
    return this.getProducts(4, 10).pipe(map(res => res.products)); 
  }
}
