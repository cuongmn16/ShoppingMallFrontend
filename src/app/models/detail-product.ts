export interface ProductDetail {
  name: string;
  mainImage: string;
  images: string[];
  originalPrice?: number;
  price: number;
  stock: number;
  discountPercent?: number;

  rating: number;
  reviewCount: number;
  soldCount: number;

  /** Thuộc tính chung (hiển thị phần “Chi tiết sản phẩm”) */
  attributes: { name: string; value: string }[];

  /** Thuộc tính cho lọc size / color */
  productAttributes: { attributeName: string; attributeValue: string }[];

  /** Biến thể */
  productVariations: ProductVariation[];

  /** Review + breakdown */
  reviews: Review[];
  ratingBreakdown: ReviewBreakdown[];

  /** Thông tin shop */
  shopId: number;
  shopName: string;
  shopLogo?: string;
  lastOnline?: string;
  shopStats: {
    reviews: number;
    responseRate: number;
    joinedTime: string;
    products: number;
    followers: number;
  };

  /** Mô tả HTML */
  description?: string;
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
  /** Id biến thể (backend trả xuống) */
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




