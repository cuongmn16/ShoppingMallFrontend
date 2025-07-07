import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { CartResponse } from "../models/response/cart-response";
import {OrderRequest, OrderItemsRequest, OrderItemsPatch} from "../models/request/cart-request";
import { OrdersResponse } from '../models/response/order-response.model';

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

  getOrdersByUser(
    username: string,
    pageNumber = 1,
    pageSize = 20
  ): Observable<OrdersResponse[]> {
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


  getCart(
    username: string,
    pageNumber = 1,
    pageSize = 20
  ): Observable<OrdersResponse> {
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

  getOrderDetail(orderId: number): Observable<OrdersResponse> {
    return this.http
      .get<ApiResponse<OrdersResponse>>(`${this.ordersUrl}/${orderId}`)
      .pipe(map((res) => res.result));
  }

  createOrder(req: OrderRequest): Observable<OrdersResponse> {
    return this.http
      .post<ApiResponse<OrdersResponse>>(this.ordersUrl, req)
      .pipe(map(res => res.result));
  }

  getItemsByOrder(orderId: number): Observable<CartResponse[]> {
    return this.http
      .get<ApiResponse<CartResponse[]>>(`${this.orderItemsUrl}/order/${orderId}`)
      .pipe(map((res) => res.result));
  }

  getItemById(itemId: number): Observable<CartResponse> {
    return this.http
      .get<ApiResponse<CartResponse>>(`${this.orderItemsUrl}/${itemId}`)
      .pipe(map((res) => res.result));
  }

  addItem(req: OrderItemsRequest): Observable<CartResponse> {
    return this.http
      .post<ApiResponse<CartResponse>>(this.orderItemsUrl, req)
      .pipe(map((res) => res.result));
  }

  updateItem(itemId: number, req: Partial<OrderItemsRequest>): Observable<CartResponse> {
    return this.http
      .put<ApiResponse<CartResponse>>(`${this.orderItemsUrl}/${itemId}`, req)
      .pipe(map((res) => res.result));
  }

  removeItem(itemId: number): Observable<CartResponse> {
    return this.http
      .delete<ApiResponse<CartResponse>>(`${this.orderItemsUrl}/${itemId}`)
      .pipe(map((res) => res.result));
  }

  removeItems(ids: number[]): Observable<CartResponse> {
    return this.http
      .post<ApiResponse<CartResponse>>(`${this.orderItemsUrl}/delete-batch`, ids)
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
