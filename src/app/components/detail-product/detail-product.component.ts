import {
  Component,
  OnInit,
  OnDestroy,          // giữ nếu vẫn implements OnDestroy (dù hàm rỗng)
  signal,
  WritableSignal,
  computed,
  DestroyRef,         // 👈 thêm
  inject              // 👈 thêm
} from '@angular/core';

import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {HomeService} from '../../services/home.service';
import {CartService} from '../../services/cart.service';
import {
  ProductDetail,
  ProductVariation,
  ReviewBreakdown,
  Review
} from '../../models/detail-product';


@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);

  orderId!: number;
  productId!: number;
  productDetail!: ProductDetail;
  currentImage: string | null = null;

  /** UI flags */
  isLoading = signal(true);
  isError = signal(false);

  /** selections */
  selectedSize: WritableSignal<string | null> = signal(null);
  selectedColor: WritableSignal<string | null> = signal(null);
  quantity: WritableSignal<number> = signal(1);

  /** computed */
  selectedVariation = computed<ProductVariation | null>(() => {
    if (!this.productDetail) return null;
    return this.productDetail.productVariations?.find(v => {
      const sizeOk = !this.selectedSize() || v.attributes.size === this.selectedSize();
      const colorOk = !this.selectedColor() || v.attributes.color === this.selectedColor();
      return sizeOk && colorOk;
    }) ?? null;
  });
  price = computed<number>(() => this.selectedVariation()?.price ?? this.productDetail?.price ?? 0);
  stock = computed<number>(() => this.selectedVariation()?.stock ?? this.productDetail?.stock ?? 0);

  /** review filter */
  activeFilter: string = 'all';
  filters = [
    {key: 'all', label: 'Tất cả'},
    {key: 'with-comment', label: 'Có bình luận'},
    {key: 'with-media', label: 'Có hình ảnh'},
    {key: '5', label: '5 sao'},
    {key: '4', label: '4 sao'}
  ];

  ratingBreakdown: ReviewBreakdown[] = [];
  productDetails: { label: string; value: string }[] = [];
  shopStats: { label: string; value: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private cartService: CartService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.productId = +(this.route.snapshot.paramMap.get('productId') ?? 0);
    if (!this.productId) {
      this.isError.set(true);
      return;
    }
    this.loadDetailProduct();
  }

  ngOnDestroy(): void {
  }

  loadDetailProduct(): void {
    this.isLoading.set(true);
    this.homeService
      .getProductDetail(this.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.productDetail = res.result;
          this.currentImage = this.productDetail.mainImage;
          this.prepareExtraData();
          this.isLoading.set(false);
        },
        error: () => {
          this.isError.set(true);
          this.isLoading.set(false);
        }
      });
  }

  prepareExtraData() {
    this.productDetails = this.productDetail.attributes.map(a => ({label: a.name, value: a.value}));
    this.ratingBreakdown = this.productDetail.ratingBreakdown;
    this.shopStats = [
      {label: 'Đánh giá', value: this.productDetail.shopStats.reviews.toString()},
      {label: 'Tỷ lệ phản hồi', value: this.productDetail.shopStats.responseRate + '%'},
      {label: 'Tham gia', value: this.productDetail.shopStats.joinedTime},
      {label: 'Sản phẩm', value: this.productDetail.shopStats.products.toString()},
      {label: 'Người theo dõi', value: this.productDetail.shopStats.followers.toString()}
    ];
    this.selectedSize.set(this.getAttributeValues('size')[0] ?? null);
    this.selectedColor.set(this.getAttributeValues('color')[0] ?? null);
  }

  getAttributeValues(name: string): string[] {
    const attr = this.productDetail?.productAttributes.find(a => a.attributeName.toLowerCase() === name.toLowerCase());
    return attr ? attr.attributeValue.split(',').map(v => v.trim()) : [];
  }

  /** quantity */
  increaseQuantity() {
    if (this.quantity() < this.stock()) this.quantity.set(this.quantity() + 1);
  }

  decreaseQuantity() {
    if (this.quantity() > 1) this.quantity.set(this.quantity() - 1);
  }

  onQuantityInput(e: Event) {
    const val = +(e.target as HTMLInputElement).value;
    if (!isNaN(val) && val >= 1 && val <= this.stock()) this.quantity.set(val);
  }

  /** variations */
  onSizeChange(v: string) {
    this.selectedSize.set(v);
  }

  onColorChange(v: string) {
    this.selectedColor.set(v);
  }

  changeMainImage(img: string) {
    this.currentImage = img;
  }

  /** cart */
  addToCart() {
    this.cartService.addItem({
      orderId: this.orderId,
      productId: this.productId,
      variationId: this.selectedVariation()?.id ?? null,
      quantity: this.quantity()
    }).subscribe();
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  /** wishlist & share */
  toggleWishlist() { /* TODO */
  }

  shareProduct() {
    navigator.share?.({url: location.href, title: this.productDetail.name})?.catch(() => {
    });
  }

  /** shop */
  chat() {
  }

  viewShop() {
    this.router.navigate(['/shop', this.productDetail.shopId]);
  }

  /** reviews */
  filteredReviews(): Review[] {
    if (!this.productDetail) return [];
    const all = this.productDetail.reviews;
    switch (this.activeFilter) {
      case 'with-comment':
        return all.filter(r => !!r.content);
      case 'with-media':
        return all.filter(r => r.images?.length);
      case '5':
        return all.filter(r => r.rating === 5);
      case '4':
        return all.filter(r => r.rating === 4);
      default:
        return all;
    }
  }

  setReviewFilter(key: string) {
    this.activeFilter = key;
  }

  likeReview(id: string) { /* TODO */
  }

  openImageModal(img: string) { /* TODO */
  }

  /** util */
  trackByIndex(_i: number) {
    return _i;
  }
}
