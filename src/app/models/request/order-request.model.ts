/**
 * Thông tin tạo đơn hàng mới
 */
export interface OrderRequest {
  userId: number;
  shippingAddress: string;
  total: number;
  shippingFee?: number;
  discount?: number;
  items: OrderItemRequest[];
}

/**
 * Item chi tiết gửi kèm trong OrderRequest
 */
export interface OrderItemRequest {
  productId: number;
  quantity: number;
  /** Giá tại thời điểm tạo đơn (để tránh thay đổi giá) */
  price: number;
  variationId?: number | null;
}
