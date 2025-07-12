// =============================
// Order Item (món trong giỏ)
// =============================
export interface OrderItem {
  itemId: number;
  orderId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  variationId?: number;

  // optional BE fields
  product?: {
    originalPrice?: number;
    image?: string;
    variations?: any[]; // nếu có variation model thì import thay any
  };
}

// =============================
// OrdersResponse (1 đơn hàng / giỏ)
// =============================
export interface OrdersResponse {
  orderId: number;
  userId: number;
  orderItems: OrderItem[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =============================
// CartItem (mapping cho UI)
// =============================
export interface CartItem {
  itemId: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string; // sau khi format URL
  price: number;
  originalPrice?: number;
  quantity: number;
  variationId?: number;
  selected: boolean; // cho checkbox
  availableVariations: any[];
}
