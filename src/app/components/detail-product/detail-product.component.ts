import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  images: string[];
  video?: string;
  stock: number;
  deliveryTime: string;
  shippingFee: number;
  variations: ProductVariation[];
  specifications: ProductSpec[];
  vouchers: Voucher[];
  shop: Shop;
}

export interface ProductVariation {
  name: string;
  options: { label: string; value: string }[];
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Voucher {
  code: string;
  description: string;
}

export interface Shop {
  name: string;
  logo: string;
  rating: number;
  followers: number;
}

export interface Review {
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
  images?: string[];
}

export interface Location {
  id: string;
  name: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  reviewCount: number;
}
@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  // Product data
  product: Product = {
    id: 1,
    name: 'iPhone 14 Pro Max 128GB - Chính hãng VN/A',
    shortDescription: 'Siêu phẩm iPhone 14 Pro Max với chip A16 Bionic mạnh mẽ, camera 48MP chuyên nghiệp, màn hình Dynamic Island đột phá.',
    fullDescription: `
      <h3>Điện thoại iPhone 14 Pro Max - Đỉnh cao công nghệ</h3>
      <p>iPhone 14 Pro Max là chiếc smartphone cao cấp nhất trong series iPhone 14, mang đến trải nghiệm tuyệt vời với:</p>
      <ul>
        <li>Chip A16 Bionic 4nm tiên tiến nhất</li>
        <li>Camera chính 48MP với chế độ Action Mode</li>
        <li>Màn hình Super Retina XDR 6.7 inch với Dynamic Island</li>
        <li>Pin sử dụng cả ngày dài</li>
      </ul>
    `,
    currentPrice: 27990000,
    originalPrice: 31990000,
    discount: 12,
    rating: 4.8,
    reviewCount: 1247,
    isNew: true,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500'
    ],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    stock: 25,
    deliveryTime: '2-3 ngày',
    shippingFee: 0,
    variations: [
      {
        name: 'Màu sắc',
        options: [
          { label: 'Tím Deep Purple', value: 'purple' },
          { label: 'Vàng Gold', value: 'gold' },
          { label: 'Bạc Silver', value: 'silver' },
          { label: 'Đen Space Black', value: 'black' }
        ]
      },
      {
        name: 'Dung lượng',
        options: [
          { label: '128GB', value: '128gb' },
          { label: '256GB', value: '256gb' },
          { label: '512GB', value: '512gb' },
          { label: '1TB', value: '1tb' }
        ]
      }
    ],
    specifications: [
      { name: 'Màn hình', value: '6.7 inch Super Retina XDR' },
      { name: 'Chip xử lý', value: 'A16 Bionic' },
      { name: 'Camera sau', value: '48MP + 12MP + 12MP' },
      { name: 'Camera trước', value: '12MP TrueDepth' },
      { name: 'Pin', value: '4323 mAh' },
      { name: 'Hệ điều hành', value: 'iOS 16' },
      { name: 'Trọng lượng', value: '240g' },
      { name: 'Kích thước', value: '160.7 x 77.6 x 7.85 mm' }
    ],
    vouchers: [
      { code: 'SAVE500K', description: 'Giảm 500K cho đơn từ 20 triệu' },
      { code: 'FREESHIP', description: 'Miễn phí vận chuyển toàn quốc' },
      { code: 'TRADE10', description: 'Giảm thêm 10% khi thu cũ đổi mới' }
    ],
    shop: {
      name: 'Apple Store Official',
      logo: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100',
      rating: 4.9,
      followers: 125000
    }
  };

  // Component state
  selectedImage: string = '';
  selectedVariations: { [key: string]: string } = {};
  quantity: number = 1;
  isInWishlist: boolean = false;
  isZooming: boolean = false;
  zoomPosition: string = '0% 0%';
  selectedLocation: string = '';
  activeTab: number = 0;
  selectedReviewFilter: string = 'all';

  // Data arrays
  locations: Location[] = [
    { id: 'hanoi', name: 'Hà Nội' },
    { id: 'hcm', name: 'TP. Hồ Chí Minh' },
    { id: 'danang', name: 'Đà Nẵng' },
    { id: 'cantho', name: 'Cần Thơ' },
    { id: 'haiphong', name: 'Hải Phòng' }
  ];

  tabs = [
    { title: 'Mô tả sản phẩm' },
    { title: 'Đánh giá' },
    { title: 'Vận chuyển & Đổi trả' }
  ];

  reviews: Review[] = [
    {
      userName: 'Nguyễn Minh Hạnh',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2e5?w=100',
      rating: 5,
      comment: 'Sản phẩm rất tốt, giao hàng nhanh. iPhone 14 Pro Max chạy mượt mà, camera chụp ảnh đẹp. Rất hài lòng với mua hàng này.',
      date: new Date('2024-01-15'),
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200']
    },
    {
      userName: 'Trần Văn Đức',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      rating: 5,
      comment: 'Pin trâu, chơi game cả ngày không lo hết pin. Màn hình đẹp, màu sắc sống động. Đáng tiền!',
      date: new Date('2024-01-10')
    },
    {
      userName: 'Lê Thị Mai',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      rating: 4,
      comment: 'Sản phẩm tốt nhưng giá hơi cao. Tuy nhiên chất lượng Apple luôn đáng tin cậy.',
      date: new Date('2024-01-08')
    }
  ];

  filteredReviews: Review[] = [];

  reviewFilters = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Có hình ảnh', value: 'with-images' },
    { label: '5 sao', value: '5' },
    { label: '4 sao', value: '4' },
    { label: '3 sao', value: '3' },
    { label: '2 sao', value: '2' },
    { label: '1 sao', value: '1' }
  ];

  ratingBreakdown = [
    { star: 5, count: 1000, percentage: 80 },
    { star: 4, count: 200, percentage: 16 },
    { star: 3, count: 30, percentage: 2.4 },
    { star: 2, count: 10, percentage: 0.8 },
    { star: 1, count: 7, percentage: 0.8 }
  ];

  relatedProducts: RelatedProduct[] = [
    {
      id: 2,
      name: 'iPhone 14 Pro 128GB',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
      price: 24990000,
      reviewCount: 850
    },
    {
      id: 3,
      name: 'iPhone 14 128GB',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      price: 19990000,
      reviewCount: 920
    },
    {
      id: 4,
      name: 'AirPods Pro 2',
      image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=300',
      price: 5990000,
      reviewCount: 450
    },
    {
      id: 5,
      name: 'Apple Watch Ultra',
      image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300',
      price: 18990000,
      reviewCount: 320
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.selectedImage = this.product.images[0];
    this.filteredReviews = this.reviews;

    // Initialize default variations
    this.product.variations.forEach(variation => {
      this.selectedVariations[variation.name] = variation.options[0].value;
    });
  }

  // Image methods
  selectImage(image: string): void {
    this.selectedImage = image;
  }

  enableZoom(event: MouseEvent): void {
    this.isZooming = true;
    this.updateZoomPosition(event);
  }

  disableZoom(): void {
    this.isZooming = false;
  }

  updateZoomPosition(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomPosition = `${x}% ${y}%`;
  }

  // Variation methods
  selectVariation(variationName: string, value: string): void {
    this.selectedVariations[variationName] = value;
    // Here you would typically update price and images based on selected variation
    console.log('Selected variations:', this.selectedVariations);
  }

  // Quantity methods
  increaseQuantity(): void {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Action methods
  addToCart(): void {
    const cartItem = {
      product: this.product,
      quantity: this.quantity,
      selectedVariations: this.selectedVariations
    };
    console.log('Adding to cart:', cartItem);
    // Implement cart service call here
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  }

  buyNow(): void {
    console.log('Buy now clicked');
    // Implement direct purchase logic
    alert('Chuyển đến trang thanh toán...');
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
    console.log('Wishlist toggled:', this.isInWishlist);
  }

  // Shop methods
  viewShop(): void {
    console.log('View shop clicked');
    // Navigate to shop page
  }

  followShop(): void {
    console.log('Follow shop clicked');
    // Implement follow shop logic
  }

  // Shipping methods
  calculateShipping(): void {
    console.log('Calculate shipping for location:', this.selectedLocation);
    // Implement shipping calculation logic
  }

  // Tab methods
  switchTab(index: number): void {
    this.activeTab = index;
  }

  // Review methods
  filterReviews(filter: string): void {
    this.selectedReviewFilter = filter;

    switch (filter) {
      case 'all':
        this.filteredReviews = this.reviews;
        break;
      case 'with-images':
        this.filteredReviews = this.reviews.filter(review => review.images && review.images.length > 0);
        break;
      case '5':
      case '4':
      case '3':
      case '2':
      case '1':
        this.filteredReviews = this.reviews.filter(review => review.rating === parseInt(filter));
        break;
      default:
        this.filteredReviews = this.reviews;
    }
  }

  // Share methods
  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.product.name);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
  }

  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.product.name);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
  }

  shareOnZalo(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.product.name);
    window.open(`https://zalo.me/share?url=${url}&title=${title}`, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Đã sao chép link sản phẩm!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

  // Helper methods
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}
