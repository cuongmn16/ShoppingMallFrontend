  import { Injectable } from '@angular/core';
  import {HttpClient} from '@angular/common/http';
  import {map, Observable} from 'rxjs';
  import {Category} from '../models/category';
  import {Product} from '../models/product';
  import {ProductDetail} from '../models/detail-product';
  import { Paged } from '../models/paged';
  import {response} from 'express';

  interface ApiResponse<T> {
    result: T;
    totalPages?: number; // Optional, if backend provides it
    totalItems?: number; // Optional
  }

  @Injectable({
    providedIn: 'root'
  })
  export class HomeService {
    private baseUrl ="http://localhost:8080/api"

    constructor(private httpClient: HttpClient) { }

    getAllCategories(): Observable<Category[]> {
      return this.httpClient.get<{ code: number; result: Category[] }>(this.baseUrl + '/categories')
        .pipe(map(response => response.result));
    }

    getAllProducts(pageNumber: number, pageSize: number): Observable<Product[]> {
      const params = { pageNumber, pageSize };
      return this.httpClient
        .get<{ code: number; result: { stats: any; products: Product[] } }>(
          `${this.baseUrl}/products`, { params }
        )
        .pipe(map(res => res.result.products));   // <-- chỉ lấy mảng products
    }

    getAllProductsByCategory(
      id: number, pageNumber: number, pageSize: number
    ): Observable<Product[]> {
      const params = { pageNumber, pageSize };
      return this.httpClient
        .get<{ code: number; result: Product[] }>(
          `${this.baseUrl}/products/category/${id}`, { params }
        )
        .pipe(map(res => res.result));
    }

    getProductDetail(productId: number): Observable<ApiResponse<ProductDetail>> {
      return this.httpClient.get<ApiResponse<ProductDetail>>(`${this.baseUrl}/products/${productId}`);
    }

    getCategoriesByParentId(parentId: number): Observable<Category[]> {
      return this.httpClient
        .get<{ code: number; result: Category[] }>(`${this.baseUrl}/categories/parent/${parentId}`)
        .pipe(map(response => response.result));
    }

    getRootCategories(): Observable<Category[]> {
      return this.httpClient
        .get<{ code: number; result: Category[] }>(`${this.baseUrl}/categories/parent-null`)
        .pipe(map(response => response.result));
    }

    getRecommendedProducts(): Observable<Product[]> {
      return this.httpClient.get<{ code: number; result: Product[]}>(`${this.baseUrl}/products/recommended`)
        .pipe(map(res => res.result));
    }
  }
