import { ProductStatus } from './product';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  variant?: string;
  selected: boolean;
  categoryId?: number;
  sellerId?: number;
  stockQuantity?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  variant?: string;
  categoryId?: number;
  sellerId?: number;
  stockQuantity?: number;
  description?: string;
  rating?: number;
  productStatus?: ProductStatus;
}

export interface CartSummary {
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface OrderRequest {
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discount: number;
  couponCode: string | null;
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  variationId?: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENT' | 'FIXED' | 'SHIPPING';
  discountValue: number;
  minOrderValue: number;
  expiryDate: Date;
  isActive: boolean;
}
