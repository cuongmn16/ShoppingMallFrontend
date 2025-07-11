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
  faArrowLeft,
  faCartPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, takeUntil } from 'rxjs';
import { HomeService } from '../../services/home.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import {OrdersResponse} from '../../models/response/order-response.model';

export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  variant?: string;
  variationId?: number;
  availableVariations?: { id: number; name: string }[];
  price: number;
  originalPrice?: number;
  quantity: number;
  selected: boolean;
}

export interface Product {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  soldQuantity?: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  // FontAwesome icons
  faCartShopping = faCartShopping;
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCartPlus = faCartPlus;

  isLoggedIn = false;
  cartItems: CartItem[] = [];

  couponCode = '';
  couponMessage = '';
  discount = 0;
  shippingFee = 30_000;

  recommendedProducts: Product[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly homeService: HomeService,
    private readonly router: Router,
    private readonly cartSvc: CartService,
    private readonly authSvc: AuthService,
  ) {}

  // -------------------- Lifecycle --------------------
  ngOnInit(): void {
    this.loadRecommendedProducts();
    this.isLoggedIn = this.authSvc.isLoggedIn();

    if (!this.isLoggedIn) return;

    const username = this.authSvc.getCurrentUsername();
    if (!username) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCart(username);
  }

  loadCart(username: string): void {
    this.cartSvc.getOrdersByUser(username, 1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          /* ❶ Nếu BE trả mảng → dùng như cũ
             ❷ Nếu BE trả object → ép thành mảng */
          const orders: OrdersResponse[] =
            Array.isArray(res) ? res : [res];

          const cartOrder = orders.find(o => o.status === 'CART');
          const items = Array.isArray(cartOrder?.orderItems)
            ? cartOrder!.orderItems
            : Object.values(cartOrder?.orderItems ?? {});  // nếu BE gửi object key‑value

          this.cartItems = items.map<CartItem>((i: any) => ({
            productId     : i.product?.id    ?? i.productId,
            productName   : i.product?.name  ?? i.productName ?? 'N/A',
            productImage  : i.product?.image ?? 'assets/img/no-image.png',
            price         : i.product?.price ?? i.unitPrice  ?? 0,
            originalPrice : i.product?.originalPrice ?? null,
            quantity      : i.quantity ?? 1,
            variationId   : i.variationId,
            selected      : false,
            availableVariations: i.product?.variations ?? [],
          }));
        },
        error: () => { this.cartItems = []; }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // -------------------- Selection --------------------
  get allItemsSelected(): boolean {
    return this.cartItems.length > 0 && this.cartItems.every((item) => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some((item) => item.selected);
  }

  selectedItemsCount(): number {
    return this.cartItems.filter((item) => item.selected).length;
  }

  toggleSelectAll(): void {
    const allSelected = this.allItemsSelected;
    this.cartItems.forEach((item) => (item.selected = !allSelected));
  }

  toggleSelectItem(index: number): void {
    this.cartItems[index].selected = !this.cartItems[index].selected;
  }

  increaseQuantity(index: number): void {
    const item = this.cartItems[index];
    item.quantity++;
    this.cartSvc.updateItem(item.productId, {
      quantity: item.quantity,
      variationId: item.variationId
    }).subscribe();
  }

  decreaseQuantity(index: number): void {
    const item = this.cartItems[index];
    if (item.quantity > 1) {
      item.quantity--;
      this.cartSvc.updateItem(item.productId, {
        quantity: item.quantity,
        variationId: item.variationId
      }).subscribe();
    }
  }

  onVariationChange(index: number): void {
    const item = this.cartItems[index];
    this.cartSvc.updateItem(item.productId, {
      variationId: item.variationId,
      quantity: item.quantity
    }).subscribe();
  }

  // -------------------- Remove --------------------
  removeItem(index: number): void {
    const removed = this.cartItems.splice(index, 1)[0];
    this.cartSvc.removeItem(removed.productId).subscribe();
  }

  removeSelectedItems(): void {
    const ids = this.cartItems.filter((i) => i.selected).map((i) => i.productId);
    this.cartItems = this.cartItems.filter((item) => !item.selected);
    if (ids.length) {
      this.cartSvc.removeItems(ids).subscribe();
    }
  }

  // -------------------- Totals & Coupon --------------------
  getSubtotal(): number {
    return this.cartItems
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingFee - this.discount;
  }

  applyCoupon(): void {
    if (this.couponCode.toLowerCase() === 'discount10') {
      this.discount = this.getSubtotal() * 0.1;
      this.couponMessage = 'Áp dụng mã giảm giá thành công!';
    } else {
      this.discount = 0;
      this.couponMessage = 'Mã giảm giá không hợp lệ';
    }
  }

  // -------------------- Checkout --------------------
  proceedToCheckout(): void {
    const selected = this.cartItems.filter((i) => i.selected);
    if (!selected.length) return;
    console.log('Checkout items:', selected);
    // TODO: điều hướng sang trang thanh toán
  }

  // -------------------- Recommendation --------------------
  loadRecommendedProducts(): void {
    this.homeService.getRecommendedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.recommendedProducts = Array.isArray(res)
            ? res
            : Array.isArray(res.products)
              ? res.products
              : [];
        },
        error: () => { this.recommendedProducts = []; }
      });
  }

  navigateToDetail(productId: number): void {
    this.router.navigate(['/detail-product', productId]);
  }

  // -------------------- Utils --------------------
  trackById(_: number, obj: Product | CartItem): number {
    return 'productId' in obj ? obj.productId : (obj as CartItem).productId;
  }
}
