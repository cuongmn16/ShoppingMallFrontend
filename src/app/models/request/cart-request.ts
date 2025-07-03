export interface OrderItemsRequest {
  productId: number;
  variationId?: number | null;
  quantity: number;
}

export interface OrderRequest {
  userId: number;
  shippingAddress: string;
  orderItems: OrderItemsRequest[];
}
