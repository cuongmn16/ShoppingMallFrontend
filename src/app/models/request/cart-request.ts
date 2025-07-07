export * from './order-request.model';

export interface OrderRequest {
  userId: number;
  shippingAddress: string;
  orderItems: OrderItemsRequest[];
}

export interface OrderItemsRequest {
  orderId: number;
  productId: number;
  quantity: number;
  variationId?: number | null;
}

export interface OrderItemsPatch {          // kiểu PATCH linh hoạt
  quantity?: number;
  variationId?: number;
}
