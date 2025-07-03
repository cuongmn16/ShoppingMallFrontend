import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CartResponse } from '../models/response/cart-response';
import { OrderRequest, OrderItemsRequest } from '../models/request/cart-request'; // Assuming you have this model

interface ApiResponse<T> {
  result: T;
  code?: number;
  message?: string;
}

interface OrdersResponse {
  id: number;
  userId: number;
  status: string;
  shippingAddress?: string;
  total: number;
  discount?: number;
  shippingFee?: number;
  // orderItems: OrderItemsResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api/orders';
  private baseUrl2 = 'http://localhost:8080/api/order-items';

  constructor(private http: HttpClient) {}

  // Orders -----------------------------------------------------------
  /** Get the user's cart (status = CART) */
  getCart(userId: number, pageNumber: number = 1, pageSize: number = 10): Observable<OrdersResponse[]> {
    return this.http
      .get<ApiResponse<OrdersResponse[]>>(`${this.baseUrl}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .pipe(map(res => res.result));
  }

  /** Get details of a specific order */
  getOrderDetail(orderId: number): Observable<OrdersResponse> {
    return this.http
      .get<ApiResponse<OrdersResponse>>(`${this.baseUrl}/${orderId}`)
      .pipe(map(res => res.result));
  }

  // /** Create a new order */
  // createOrder(req: OrdersRequest): Observable<OrdersResponse> {
  //   return this.http
  //     .post<ApiResponse<OrdersResponse>>(this.baseUrl, req)
  //     .pipe(map(res => res.result));
  // }
  //
  // /** Update an existing order */
  // updateOrder(orderId: number, req: OrdersRequest): Observable<OrdersResponse> {
  //   return this.http
  //     .put<ApiResponse<OrdersResponse>>(`${this.baseUrl}/${orderId}`, req)
  //     .pipe(map(res => res.result));
  // }

  // Order Items -----------------------------------------------------------
  /** Get all items for a specific order */
  getItemsByOrder(orderId: number): Observable<CartResponse[]> {
    return this.http
      .get<ApiResponse<CartResponse[]>>(`${this.baseUrl2}/order/${orderId}`)
      .pipe(map(res => res.result));
  }

  /** Get details of a specific item */
  getItemById(itemId: number): Observable<CartResponse> {
    return this.http
      .get<ApiResponse<CartResponse>>(`${this.baseUrl2}/${itemId}`)
      .pipe(map(res => res.result));
  }

  /** Add or update an item in the cart */
  addItem(req: OrderItemsRequest): Observable<CartResponse> {
    return this.http
      .post<ApiResponse<CartResponse>>(`${this.baseUrl2}`, req)
      .pipe(map(res => res.result));
  }

  /** Update item quantity */
  updateItemQuantity(itemId: number, qty: number): Observable<CartResponse> {
    return this.http
      .put<ApiResponse<CartResponse>>(`${this.baseUrl2}/${itemId}`, { quantity: qty })
      .pipe(map(res => res.result));
  }

  /** Remove a single item from the cart */
  removeItem(itemId: number): Observable<CartResponse> {
    return this.http
      .delete<ApiResponse<CartResponse>>(`${this.baseUrl2}/${itemId}`)
      .pipe(map(res => res.result));
  }

  /** Remove multiple items by IDs */
  removeItems(ids: number[]): Observable<CartResponse> {
    return this.http
      .post<ApiResponse<CartResponse>>(`${this.baseUrl2}/delete-batch`, ids)
      .pipe(map(res => res.result));
  }

  // Coupon and Checkout -----------------------------------------------------------
  /** Apply a coupon to the cart */
  applyCoupon(orderId: number, couponCode: string): Observable<OrdersResponse> {
    return this.http
      .post<ApiResponse<OrdersResponse>>(`${this.baseUrl}/${orderId}/apply-coupon`, { couponCode })
      .pipe(map(res => res.result));
  }

  /** Proceed to checkout for selected items */
  proceedToCheckout(orderId: number, selectedItemIds: number[]): Observable<OrdersResponse> {
    return this.http
      .post<ApiResponse<OrdersResponse>>(`${this.baseUrl}/${orderId}/checkout`, { selectedItemIds })
      .pipe(map(res => res.result));
  }
}
