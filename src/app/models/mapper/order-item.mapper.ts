import { OrderItem, CartItem, OrderItemResponse } from '../order-items.model';

export class OrderItemMapper {
  /**
   * API Response → FE Model
   */
  static fromResponse(res: OrderItemResponse): OrderItem {
    return {
      itemId: res.id,
      orderId: res.orderId,
      productId: res.productId,
      productName: res.productName,
      sku: '', // Nếu API có sku thì map, không thì để trống
      unitPrice: res.price,
      totalPrice: res.total,
      quantity: res.quantity,
      variationId: res.variationId,
      product: {
        id: res.productId,
        name: res.productName,
        image: res.productImage,
        price: res.price,
        originalPrice: undefined,
      },
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }

  /**
   * OrderItem → CartItem
   */
  static toCartItem(orderItem: OrderItem): CartItem {
    return {
      itemId: orderItem.itemId,
      productId: orderItem.productId,
      productName: orderItem.productName,
      productImage: orderItem.product?.image ?? '',
      price: orderItem.unitPrice,
      originalPrice: orderItem.product?.originalPrice,
      quantity: orderItem.quantity,
      selected: true,
      variationId: orderItem.variationId,
      availableVariations: orderItem.product?.variations,
    };
  }

  /**
   * Batch convert Response → Model
   */
  static fromResponseList(resList: OrderItemResponse[]): OrderItem[] {
    return resList.map((res) => this.fromResponse(res));
  }

  /**
   * Batch convert Model → CartItem
   */
  static toCartItemList(items: OrderItem[]): CartItem[] {
    return items.map((item) => this.toCartItem(item));
  }
}
