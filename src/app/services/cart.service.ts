import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { CartItem, OrdersResponse, OrderItem } from "../models/orders.model";
import { OrderItemsRequest } from "../models/request/cart-request";

export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

@Injectable({ providedIn: "root" })
export class CartService {
  private readonly baseApi = "http://localhost:8080/api"; // TODO: move to env
  private readonly ordersUrl = `${this.baseApi}/orders`;
  private readonly orderItemsUrl = `${this.baseApi}/order-items`;

  constructor(private readonly http: HttpClient) {}

  getOrdersByUser(username: string, pageNumber = 1, pageSize = 20): Observable<OrdersResponse[]> {
    const params = new HttpParams({
      fromObject: {
        pageNumber: pageNumber.toString(),
        pageSize  : pageSize.toString(),
      }
    });
    const url = `${this.ordersUrl}/user/${encodeURIComponent(username)}`;
    return this.http.get<ApiResponse<OrdersResponse[]>>(url, { params }).pipe(
      map(res => res.result ?? []),
    );
  }


  getCart(username: string, pageNumber = 1, pageSize = 20): Observable<OrdersResponse> {
    return this.getOrdersByUser(username, pageNumber, pageSize).pipe(
      map((orders) => {
        const cart = orders.find(o => o.status === 'CART');
        if (!cart) {
          throw new Error('No CART order found for user ' + username);
        }
        return cart;
      })
    );
  }

  updateItem(itemId: number, req: Partial<OrderItemsRequest>): Observable<OrdersResponse> {
    return this.http
      .put<ApiResponse<OrdersResponse>>(`${this.orderItemsUrl}/${itemId}`, req)
      .pipe(map((res) => res.result));
  }

  updateQuantity(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.patch<{ result: CartItem }>(`${this.orderItemsUrl}/${itemId}/quantity`, { quantity })
      .pipe(map(res => res.result));
  }


  removeItem(itemId: number): Observable<OrdersResponse> {
    return this.http
      .delete<ApiResponse<OrdersResponse>>(`${this.orderItemsUrl}/${itemId}`)
      .pipe(map((res) => res.result));
  }

  removeItems(ids: number[]): Observable<void> {
    return this.http
      .request<ApiResponse<void>>(
        'delete',
        `${this.orderItemsUrl}/delete-batch`,
        { body: ids }
      )
      .pipe(map((res) => res.result));
  }

  applyCoupon(orderId: number, couponCode: string): Observable<OrdersResponse> {
    return this.http
      .post<ApiResponse<OrdersResponse>>(
        `${this.ordersUrl}/${orderId}/apply-coupon`,
        { couponCode },
      )
      .pipe(map((res) => res.result));
  }

  proceedToCheckout(orderId: number, selectedItemIds: number[]): Observable<OrdersResponse> {
    return this.http
      .post<ApiResponse<OrdersResponse>>(
        `${this.ordersUrl}/${orderId}/checkout`,
        { selectedItemIds },
      )
      .pipe(map((res) => res.result));
  }
}
