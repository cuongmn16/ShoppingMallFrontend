export interface OrderItemsResponse {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  id: number;
  orderId: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
  };
  quantity: number;
  // ... các trường khác nếu có
}

