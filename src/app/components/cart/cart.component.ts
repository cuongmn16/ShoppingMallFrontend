import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { faCartShopping, faTrash, faMinus, faPlus, faArrowRight, faArrowLeft, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, takeUntil } from 'rxjs';
import { HomeService } from '../../services/home.service';

export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  variant?: string;
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
  discount?: number; // Added
  soldQuantity?: number; // Added
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  faCartShopping = faCartShopping;
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCartPlus = faCartPlus;

  cartItems: CartItem[] = [
    {
      productId: 1,
      productName: 'Sản phẩm mẫu 1',
      productImage: 'https://cdn1.viettelstore.vn/images/Product/ProductImage/medium/15-Ultra.Sil1.jpg',
      variant: 'Đen, 128GB',
      price: 20_000_000,
      originalPrice: 25_200_000,
      quantity: 1,
      selected: false
    },
    {
      productId: 2,
      productName: 'Sản phẩm mẫu 2',
      productImage: 'https://aokhoacnam.vn/upload/product/akn-182/ao-khoac-gio-nam-ghi-chinh-hang.jpg',
      price: 500_000,
      quantity: 2,
      selected: false
    }
  ];

  couponCode = '';
  couponMessage = '';
  discount = 0;
  shippingFee = 30_000;

  recommendedProducts: Product[] = [];

  private destroy$ = new Subject<void>();

  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
    this.loadRecommendedProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get allItemsSelected(): boolean {
    return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }

  selectedItemsCount(): number {
    return this.cartItems.filter(item => item.selected).length;
  }

  toggleSelectAll(): void {
    const allSelected = this.allItemsSelected;
    this.cartItems.forEach(item => (item.selected = !allSelected));
  }

  toggleSelectItem(index: number): void {
    this.cartItems[index].selected = !this.cartItems[index].selected;
  }

  getSubtotal(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingFee - this.discount;
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }

  removeSelectedItems(): void {
    this.cartItems = this.cartItems.filter(item => !item.selected);
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

  proceedToCheckout(): void {
    const selected = this.cartItems.filter(i => i.selected);
    if (selected.length) {
      console.log('Checkout với items:', selected);
      // TODO: điều hướng sang trang thanh toán
    }
  }

  loadRecommendedProducts(): void {
    this.homeService.getRecommendedProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: Product[]) => {
          this.recommendedProducts = products;
        },
        error: err => console.error('Error loading recommended products:', err)
      });
  }

  navigateToDetail(productId: number): void {
    this.router.navigate(['/detail-product', productId]);
  }

  trackById(_: number, product: Product): number {
    return product.productId;
  }
}
