// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { CartResponse } from '../models/response/cart-response';
import { OrderItemsRequest } from '../models/request/cart-request';

interface ApiResponse<T> {
  result: T;
  code?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  /** Lấy giỏ hàng (status = CART) của user hiện tại */
  getCart(): Observable<CartResponse> {
    return this.http
      .get<ApiResponse<CartResponse>>(this.baseUrl)
      .pipe(map(res => res.result));
  }

  /** Thêm hoặc cập nhật một item trong giỏ */
  addItem(req: OrderItemsRequest): Observable<CartResponse> {
    return this.http
      .post<ApiResponse<CartResponse>>(`${this.baseUrl}/items`, req)
      .pipe(map(res => res.result));
  }

  /** Cập nhật số lượng (PATCH) */
  updateItemQuantity(itemId: number, qty: number): Observable<CartResponse> {
    return this.http
      .patch<ApiResponse<CartResponse>>(
        `${this.baseUrl}/items/${itemId}`,
        { quantity: qty }
      )
      .pipe(map(res => res.result));
  }

  /** Xoá 1 item khỏi giỏ */
  removeItem(itemId: number): Observable<CartResponse> {
    return this.http
      .delete<ApiResponse<CartResponse>>(`${this.baseUrl}/items/${itemId}`)
      .pipe(map(res => res.result));
  }

  /** Xoá nhiều item theo danh sách id */
  removeItems(ids: number[]): Observable<CartResponse> {
    return this.http
      .post<ApiResponse<CartResponse>>(`${this.baseUrl}/items/delete-batch`, ids)
      .pipe(map(res => res.result));
  }
}
