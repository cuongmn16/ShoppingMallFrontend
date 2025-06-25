import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash, faMinus, faPlus, faArrowLeft, faArrowRight,
  faCartShopping, faCartPlus
} from '@fortawesome/free-solid-svg-icons';
import { CartItem, Product } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    CurrencyPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  // FontAwesome icons
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faCartShopping = faCartShopping;
  faCartPlus = faCartPlus;

  // Cart data
  cartItems: CartItem[] = [];
  allItemsSelected = false;

  // Order summary
  discount = 0;
  shippingFee = 20000; // Default shipping fee
  couponCode = '';
  couponMessage = '';

  // Recommended products
  recommendedProducts: Product[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.loadRecommendedProducts();
  }

  // Load cart items from CartService
  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.updateAllItemsSelectedState();

    // Calculate shipping fee
    this.updateShippingFee();

    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateAllItemsSelectedState();
      this.updateShippingFee();
    });
  }

  // Load recommended products
  loadRecommendedProducts(): void {
    // In a real application, this would be fetched from an API
    this.recommendedProducts = [
      {
        id: 4,
        name: 'Đồng Hồ Thông Minh Chống Nước',
        price: 1290000,
        originalPrice: 1790000,
        image: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbk1-lp03dcrftbdk88'
      },
      {
        id: 5,
        name: 'Loa Bluetooth Mini Chống Nước IPX7',
        price: 490000,
        image: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rbm0-lox9gnbd8xksd0'
      },
      {
        id: 6,
        name: 'Pin Sạc Dự Phòng 20000mAh',
        price: 390000,
        originalPrice: 590000,
        image: 'https://down-vn.img.susercontent.com/file/sg-11134201-7qvf1-lfa1aqmjx1iv84'
      },
      {
        id: 7,
        name: 'Bàn Phím Cơ Gaming RGB',
        price: 890000,
        image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lkqzv0jlwlx2cb'
      }
    ];
  }

  // Update shipping fee based on subtotal
  updateShippingFee(): void {
    // Free shipping for orders over 300,000 VND
    const subtotal = this.getSubtotal();
    this.shippingFee = subtotal >= 300000 ? 0 : 20000;
  }

  // Item selection methods
  toggleSelectAll(): void {
    this.allItemsSelected = !this.allItemsSelected;
    this.cartService.selectAllItems(this.allItemsSelected);
  }

  toggleSelectItem(index: number): void {
    this.cartService.toggleItemSelection(index);
  }

  updateAllItemsSelectedState(): void {
    this.allItemsSelected = this.cartService.areAllItemsSelected();
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }

  selectedItemsCount(): number {
    return this.cartItems.filter(item => item.selected).length;
  }

  // Item manipulation methods
  increaseQuantity(index: number): void {
    if (this.cartItems[index].quantity < (this.cartItems[index].stockQuantity || 99)) {
      this.cartService.updateQuantity(index, this.cartItems[index].quantity + 1);
    } else {
      this.toastr.warning(`Chỉ còn ${this.cartItems[index].stockQuantity || 99} sản phẩm trong kho`);
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartService.updateQuantity(index, this.cartItems[index].quantity - 1);
    }
  }

  removeItem(index: number): void {
    // Confirm before removing
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      this.cartService.removeItem(index);
    }
  }

  removeSelectedItems(): void {
    if (this.selectedItemsCount() === 0) {
      this.toastr.warning('Vui lòng chọn ít nhất một sản phẩm để xóa');
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedItemsCount()} sản phẩm đã chọn?`)) {
      const selectedIndices = this.cartItems
        .map((item, index) => item.selected ? index : -1)
        .filter(index => index !== -1);

      this.cartService.removeItems(selectedIndices);
    }
  }

  // Order summary methods
  getSubtotal(): number {
    return this.cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getTotal(): number {
    return this.getSubtotal() + this.shippingFee - this.discount;
  }

  applyCoupon(): void {
    // Validate coupon code
    if (!this.couponCode || this.couponCode.trim() === '') {
      this.toastr.warning('Vui lòng nhập mã giảm giá');
      return;
    }

    const subtotal = this.getSubtotal();

    // Apply coupon using CartService
    this.cartService.applyCoupon(this.couponCode, subtotal).subscribe(result => {
      this.discount = result.discount;
      this.couponMessage = result.message;

      if (result.discount > 0) {
        this.toastr.success('Mã giảm giá đã được áp dụng!');
      } else {
        this.toastr.error(result.message);
      }
    });
  }

  // Product interaction methods
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  // Checkout process
  proceedToCheckout(): void {
    if (this.selectedItemsCount() === 0) {
      this.toastr.warning('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }

    // Prepare order data
    const orderData = {
      items: this.cartItems.filter(item => item.selected).map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: this.getTotal(),
      shippingFee: this.shippingFee,
      discount: this.discount,
      couponCode: this.couponCode || null
    };

    // Create order using CartService
    this.cartService.createOrder(orderData).subscribe(response => {
      if (response.success) {
        this.toastr.success('Đơn hàng đã được tạo thành công!');
        // Navigate to checkout page with order ID
        this.router.navigate(['/checkout'], { queryParams: { orderId: response.orderId } });
      } else {
        this.toastr.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
      }
    });
  }
}
