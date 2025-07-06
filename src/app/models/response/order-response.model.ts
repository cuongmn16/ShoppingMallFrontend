import {CartResponse} from './cart-response';

export interface OrdersResponse {
  id: number;
  userId: number;
  status: 'CART' | 'PENDING' | 'PAID' | 'CANCELLED';
  total: number;
  shippingFee?: number;
  discount?: number;
  orderItems: CartResponse[];  // 👈 thêm dòng này
}

