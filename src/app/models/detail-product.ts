export interface ProductDetail {
    productId: number;
    sellerId: number;
    categoryId: number;
    productName: string;
    description: string | null;
    price: number;
    originalPrice: number;
    discount: number;
    stockQuantity: number;
    soldQuantity: number;
    rating: number;
    productStatus: string;
    productImage: string | null;
    shopName: string;
    shopDescription: string | null;
    shopLogo: string | null;
    productImages: ProductImage[];
    productAttributes: ProductAttribute[];
    productVariations: ProductVariation[];
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
