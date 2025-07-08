import {ProductImage} from './product-image';
import {ProductVariation} from './product-variation';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface Product {
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
  productImage: string;
  shopName: string;
  shopDescription: string;
  shopLogo: string;
  productImages: ProductImage[];
  variations: ProductVariation[];
}
