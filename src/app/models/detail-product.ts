import {ProductStatus} from './product';

export interface ProductDetail {
  productId: number;
  sellerId: number;
  categoryId: number;
  productName: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stockQuantity: number;
  soldQuantity: number;
  rating: number;
  productStatus: ProductStatus;
  shopName: string;
  shopDescription: string;
  shopLogo: string;
  productImages: ProductImage[];

}

export interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
  displayOrder: number;
  primary: boolean;
}

export interface ProductAttribute {
  attributeId: number;
  productId: number;
  attributeName: string;
  attributeValue: string;
}

export interface ProductVariation {
  variationId: number;
  productId: number;
  variationName: string;
  priceAdjustment: number;
  stockQuantity: number;
  imageUrl: string | null;
}

export interface VariationAttributes {
  size?: string;
  color?: string;
  // thêm thuộc tính khác nếu có
}

export interface ProductVariation {
  id: number;
  /** Thuộc tính (size / color …) */
  attributes: VariationAttributes;
  /** Giá và tồn kho riêng cho biến thể */
  price: number;
  stock: number;
}

export interface Review {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  content?: string;
  variant?: string;
  images?: string[];
  likes: number;
  date: string; // ISO 8601
}

export interface ReviewBreakdown {
  stars: number;       // 1‑5
  count: number;       // bao nhiêu review
  percentage: number;  // 0‑100
}




