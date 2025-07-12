import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Product} from '../../models/product';
import {HomeService} from '../../services/home.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {takeUntil, Subject} from 'rxjs';

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


@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {
  product!: Product;

  // UI state
  selectedImage: string = '';
  selectedVariations: { [key: string]: string } = {};
  quantity: number = 1;
  isInWishlist: boolean = false;
  isZooming: boolean = false;
  zoomPosition: string = '0% 0%';
  selectedLocation: string = '';
  activeTab: number = 0;
  selectedReviewFilter: string = 'all';
  productId!: number;
  products: Product[] = [];
  private destroy$ = new Subject<void>();

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

  wishlistRelatedIds = new Set<number>();

  constructor(private homeService: HomeService,
              private route: ActivatedRoute,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['productId'];
    console.log('Product ID:', this.productId);
    this.loadProductDetail();
    this.loadRecommendedProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProductDetail(): void {
    this.homeService.getProductDetail(this.productId).subscribe({
      next: (response: any) => {
        if (response && response.result) {
          this.product = response.result;
          const firstImage = this.product?.productImages?.[0]?.imageUrl;
          this.selectedImage = firstImage || '';
          this.filteredReviews = this.reviews;
        } else {
          console.error('Product not found');
        }
      },
      error: (error) => {
        console.error('Error loading product detail:', error);
      }
    });
  }

  private loadRecommendedProducts(): void {
    this.homeService
      .getRecommendedProducts(6)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
        },
        error: (err) => {
          console.error('Error fetching recommended products:', err);
        }
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
    console.log('Selected variations:', this.selectedVariations);
  }

  // Quantity methods
  increaseQuantity(): void {
    // implement if needed
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Actions
  addToCart(): void {
    const cartItem = { quantity: this.quantity, selectedVariations: this.selectedVariations };
    console.log('Adding to cart:', cartItem);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  }

  buyNow(): void {
    console.log('Buy now clicked');
    alert('Chuyển đến trang thanh toán...');
  }

  toggleWishlist(): void {
    this.isInWishlist = !this.isInWishlist;
    console.log('Wishlist toggled:', this.isInWishlist);
  }

  followShop(): void {
    console.log('Follow shop clicked');
  }

  // Shipping methods
  calculateShipping(): void {
    console.log('Calculate shipping for location:', this.selectedLocation);
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
        this.filteredReviews = this.reviews.filter(r => r.images && r.images.length > 0);
        break;
      case '5':
      case '4':
      case '3':
      case '2':
      case '1':
        this.filteredReviews = this.reviews.filter(r => r.rating === parseInt(filter, 10));
        break;
      default:
        this.filteredReviews = this.reviews;
    }
  }

  // Share methods
  shareOnFacebook(): void {}
  shareOnTwitter(): void {}
  shareOnZalo(): void {
    const url = encodeURIComponent(window.location.href);
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Đã sao chép link sản phẩm!'))
      .catch(err => console.error('Could not copy text: ', err));
  }

  // Helpers
  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  trackById(index: number, product: Product): number {
    return product.productId;
  }

  NavigateToDetailProduct(productId: number){
    this.router.navigate((['/detail-product', productId]));
  }

  toggleWishlistRelated(event: Event, productId: number): void {
    event.stopPropagation(); // tránh trigger click trên card
    if (this.wishlistRelatedIds.has(productId)) {
      this.wishlistRelatedIds.delete(productId);
    } else {
      this.wishlistRelatedIds.add(productId);
    }
    console.log('Wishlist related toggled:', Array.from(this.wishlistRelatedIds));
  }



}
