export interface OrderItemsResponse {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  cartId: number;
  userId: number;
  orderItems: OrderItemsResponse[];
}
