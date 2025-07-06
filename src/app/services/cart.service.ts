import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
} from "@angular/common/http";
import { map, Observable } from "rxjs";

// 📝—— Models ————————————————————————————————————————
import { CartResponse } from "../models/response/cart-response";
import { OrderRequest, OrderItemsRequest } from "../models/request/cart-request";
import { OrdersResponse } from '../models/response/order-response.model';

/**
 * Wrapper kiểu dữ liệu API chung của back‑end
 */
export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

@Injectable({ providedIn: "root" })
export class CartService {
  /**
   * Nên cấu hình baseApiUrl trong environment.ts để dễ switch PRODUCTION <‑> DEV
   */
  private readonly baseApi = "http://localhost:8080/api"; // TODO: move to env

  private readonly ordersUrl = `${this.baseApi}/orders`;
  private readonly orderItemsUrl = `${this.baseApi}/order-items`;

  constructor(private readonly http: HttpClient) {}

  // #region Orders ————————————————————————————————————————————

  /**
   * Lấy giỏ hàng hiện tại của user (status = CART)
   * Backend chỉ nên trả về *một* order ở trạng thái CART, nếu không hãy lấy phần tử đầu tiên.
   */
  getOrdersByUser(
    userId: number,
    pageNumber = 1,
    pageSize = 20
  ): Observable<OrdersResponse[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http
      .get<ApiResponse<OrdersResponse[]>>(
        `${this.ordersUrl}/user/${userId}`,
        { params }
      )
      .pipe(map(res => res.result));
  }

  /**
   * Lấy đơn hàng giỏ hàng (status = CART) theo userId qua API `/cart/{userId}`
   */
  getCartByUser(userId: number): Observable<OrdersResponse> {
    return this.http.get<ApiResponse<OrdersResponse>>(`${this.ordersUrl}/cart/${userId}`)
      .pipe(map(res => res.result));
  }

// 2. Hàm lấy GIỎ HÀNG (đơn có status = CART)
  getCart(
    userId: number,
    pageNumber = 1,
    pageSize = 20
  ): Observable<OrdersResponse> {
    return this.getOrdersByUser(userId, pageNumber, pageSize).pipe(
      map((orders) => {
        const cart = orders.find(o => o.status === 'CART');
        if (!cart) {
          throw new Error('No CART order found for user ' + userId);
        }
        return cart;
      })
    );
  }

  /**
   * Chi tiết một order bất kỳ
   */
  getOrderDetail(orderId: number): Observable<OrdersResponse> {
    return this.http
      .get<ApiResponse<OrdersResponse>>(`${this.ordersUrl}/${orderId}`)
      .pipe(map((res) => res.result));
  }

  /**
   * Tạo order mới – cần backend hỗ trợ và OrdersRequest model
   */
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

  /**
   * Thêm hoặc cập nhật item trong giỏ – truyền productId và quantity vào body
   */
  addItem(req: OrderItemsRequest): Observable<CartResponse> {
    return this.http
      .post<ApiResponse<CartResponse>>(this.orderItemsUrl, req)
      .pipe(map((res) => res.result));
  }

  updateItemQuantity(itemId: number, quantity: number): Observable<CartResponse> {
    return this.http
      .put<ApiResponse<CartResponse>>(`${this.orderItemsUrl}/${itemId}`, { quantity })
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

  // #endregion

  // #region Coupon / Checkout ————————————————————————————————————

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

  // #endregion
}
