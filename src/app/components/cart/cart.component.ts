import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  faCartShopping,
  faTrash,
  faMinus,
  faPlus,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {Subject, takeUntil, catchError, of, finalize} from 'rxjs';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { OrderItem, CartItem, OrdersResponse } from '../../models/orders.model';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  // Icons
  readonly faCartShopping = faCartShopping;
  readonly faTrash = faTrash;
  readonly faMinus = faMinus;
  readonly faPlus = faPlus;
  readonly faArrowRight = faArrowRight;

  // State
  isLoggedIn = false;
  cartItems: CartItem[] = [];
  products: Product[] = [];
  couponCode = '';
  couponMessage = '';
  discount = 0;
  isLoading = false;
  error: string | null = null;
  readonly shippingFee = 30_000;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly homeService: HomeService,
    private readonly router: Router,
    private readonly cartSvc: CartService,
    private readonly authSvc: AuthService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authSvc.isLoggedIn();
    this.loadRecommendedProducts();

    if (this.isLoggedIn) {
      this.loadCart();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------- Cart Operations --------------------
  private loadCart(): void {
    const username = this.authSvc.getCurrentUsername();
    if (!username) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.cartSvc.getCart(username)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res: OrdersResponse) => {
          console.log('📦 Response từ BE:', res);
          const items = res.orderItems ?? [];
          this.cartItems = items.map(item => this.mapOrderItemToCartItem(item));
          console.log('🛒 cartItems sau map:', this.cartItems);
        },
        error: (err) => {
          console.error('❌ Lỗi load giỏ hàng:', err);
          this.error = 'Không thể tải giỏ hàng. Vui lòng thử lại.';
        }
      });
  }

  private mapOrderItemToCartItem(orderItem: OrderItem): CartItem {
    // Backend của bạn có thể trả: product.image hoặc productImage
    const rawImage =
      (orderItem as any).product?.image ??
      (orderItem as any).productImage ??
      (orderItem as any).image;

    return {
      itemId: orderItem.itemId,
      orderId: orderItem.orderId,
      productId: orderItem.productId ?? (orderItem as any).productId,
      productName: orderItem.productName ?? (orderItem as any).productName,
      productImage: this.formatImageUrl(rawImage),
      price: orderItem.unitPrice ?? (orderItem as any).unitPrice,
      originalPrice: orderItem.product?.originalPrice,
      quantity: orderItem.quantity,
      variationId: orderItem.variationId,
      selected: false,
      availableVariations: orderItem.product?.variations ?? [],
    };
  }

  private formatImageUrl(imageUrl?: string): string {
    if (!imageUrl || imageUrl.trim() === '') {
      return 'assets/img/no-image.jpg';
    }

    // Đã là URL đầy đủ -> dùng luôn
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Ảnh nằm trong assets của FE
    if (imageUrl.startsWith('assets/')) {
      return imageUrl;
    }

    // Ảnh BE trả về kiểu /uploads/... hoặc uploads/...
    if (imageUrl.includes('uploads/')) {
      const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      // TODO: đổi BASE_URL nếu backend chạy ở domain/port khác
      return `http://localhost:8080${cleanPath}`;
    }

    // Fallback nếu BE trả chuỗi lạ
    return 'assets/img/no-image.jpg';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('assets/img/no-image.jpg')) {
      img.src = 'assets/img/no-image.jpg';
    }
  }

  // -------------------- Selection --------------------
  get allItemsSelected(): boolean {
    return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }

  toggleSelectAll(): void {
    const selectAll = !this.allItemsSelected;
    this.cartItems.forEach(item => item.selected = selectAll);
  }

  // -------------------- Quantity & Variation --------------------
  private updateCartItem(index: number, updates: { quantity?: number; variationId?: number }): void {
    const item = this.cartItems[index];
    if (!item.itemId) return;

    this.cartSvc.updateItem(item.itemId, updates)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (updates.quantity) item.quantity = updates.quantity;
          if (updates.variationId !== undefined) item.variationId = updates.variationId;
        },
        error: console.error
      });
  }

  increaseQuantity(index: number) {
    const item = this.cartItems[index];
    const newQuantity = item.quantity + 1;

    this.cartSvc.updateQuantity(item.itemId, newQuantity).subscribe(updatedItem => {
      this.cartItems[index] = updatedItem; // cập nhật full object, không chỉ mỗi quantity
    });
  }

  decreaseQuantity(index: number) {
    const item = this.cartItems[index];
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;

      this.cartSvc.updateQuantity(item.itemId, newQuantity).subscribe(updatedItem => {
        this.cartItems[index] = updatedItem;
      });
    }
  }

  onVariationChange(index: number): void {
    const item = this.cartItems[index];
    this.updateCartItem(index, { variationId: item.variationId, quantity: item.quantity });
  }

  // -------------------- Remove Items --------------------
  removeItem(index: number): void {
    const removed = this.cartItems.splice(index, 1)[0];
    this.cartSvc.removeItem(removed.itemId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  removeSelectedItems(): void {
    const selectedIds = this.cartItems
      .filter(i => i.selected && i.itemId != null)
      .map(i => i.itemId as number);

    if (selectedIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để xóa.');
      return;
    }

    this.cartSvc.removeItems(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Sau khi API thành công thì lọc lại danh sách
          this.cartItems = this.cartItems.filter(i => !selectedIds.includes(i.itemId!));
        },
        error: (err) => {
          console.error('Xóa giỏ hàng thất bại:', err);
          alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
        }
      });
  }

  // -------------------- Totals & Coupon --------------------
  getSubtotal(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotal(): number {
    return Math.max(0, this.getSubtotal() + this.shippingFee - this.discount);
  }

  applyCoupon(): void {
    const isValid = this.couponCode.toLowerCase() === 'discount10';
    this.discount = isValid ? this.getSubtotal() * 0.1 : 0;
    this.couponMessage = isValid ? 'Áp dụng mã giảm giá thành công!' : 'Mã giảm giá không hợp lệ';
  }

  // -------------------- Related Products --------------------
  private loadRecommendedProducts(): void {
    this.homeService
      .getAllProducts(1, 6)
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

  NavigateToDetailProduct(productId: number): void {
    this.router.navigate((['/detail-product', productId]));
  }

  // -------------------- Utils --------------------
  getVariationName(variationId: number, variations?: { id: number; name: string }[]): string {
    const variation = variations?.find(v => v.id === variationId);
    return variation?.name ?? 'N/A';
  }

  trackById(_: number, obj: any): number {
    return obj.itemId ?? obj.productId ?? obj.id ?? 0;
  }

  proceedToCheckout(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    const selectedItems = this.cartItems.filter(i => i.selected);
    if (!selectedItems.length) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.');
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
