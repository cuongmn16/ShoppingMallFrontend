import {CartResponse} from './cart-response';

export interface OrdersResponse {
  orderId: number;  // 👈 dùng đúng tên field từ backend
  userId: number;
  status: 'CART' | 'PENDING' | 'PAID' | 'CANCELLED';
  total: number;
  shippingFee?: number;
  discount?: number;
  orderItems?: CartResponse[];
}


