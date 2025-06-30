export interface OrderItemsRequest {
  productId: number;
  quantity: number;
  variant?: string;
}

export interface OrderRequest {
  userId: number;
  shippingAddress: string;
  orderItems: OrderItemsRequest[];
}
