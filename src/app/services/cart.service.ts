import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { CartItem, Product, CartSummary, OrderRequest, Coupon } from '../models/cart.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/v1';
  private cartKey = 'cart_items';

  // Observable sources
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  // Observable streams
  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.loadCart();
  }

  // Load cart from localStorage
  private loadCart(): void {
    try {
      const savedCart = localStorage.getItem(this.cartKey);
      const cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
      this.cartItemsSubject.next(cartItems);
      this.updateCartCount();
    } catch (error) {
      console.error('Error loading cart from localStorage', error);
      this.cartItemsSubject.next([]);
      this.cartCountSubject.next(0);
    }
  }

  // Save cart to localStorage
  private saveCart(cartItems: CartItem[]): void {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(cartItems));
      this.cartItemsSubject.next(cartItems);
      this.updateCartCount();
    } catch (error) {
      console.error('Error saving cart to localStorage', error);
    }
  }

  // Update cart count
  private updateCartCount(): void {
    const count = this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity, 0
    );
    this.cartCountSubject.next(count);
  }

  // Get current cart items
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Add item to cart
  addToCart(product: Product, quantity: number = 1, variant?: string): void {
    const currentCart = this.getCartItems();

    // Create a unique identifier that includes variant information
    const productIdentifier = variant
      ? `${product.id}-${variant.replace(/\s+/g, '')}`
      : `${product.id}`;

    // Find if item already exists in cart with the same variant
    const existingItemIndex = currentCart.findIndex(item => {
      const itemIdentifier = item.variant
        ? `${item.id}-${item.variant.replace(/\s+/g, '')}`
        : `${item.id}`;
      return itemIdentifier === productIdentifier;
    });

    if (existingItemIndex !== -1) {
      // Update existing item
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;

      // Check stock limits
      const stockLimit = updatedCart[existingItemIndex].stockQuantity || 99;
      if (updatedCart[existingItemIndex].quantity > stockLimit) {
        updatedCart[existingItemIndex].quantity = stockLimit;
        this.toastr.warning(`Chỉ còn ${stockLimit} sản phẩm trong kho`);
      }

      this.saveCart(updatedCart);
      this.toastr.success('Đã cập nhật số lượng sản phẩm trong giỏ hàng');
    } else {
      // Add new item
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: quantity,
        image: product.image,
        variant: variant,
        selected: false,
        categoryId: product.categoryId,
        sellerId: product.sellerId,
        stockQuantity: product.stockQuantity
      };

      this.saveCart([...currentCart, newItem]);
      this.toastr.success('Đã thêm sản phẩm vào giỏ hàng');
    }
  }

  // Update item quantity
  updateQuantity(index: number, quantity: number): void {
    const currentCart = this.getCartItems();

    if (index >= 0 && index < currentCart.length) {
      const updatedCart = [...currentCart];

      // Check if quantity is valid
      if (quantity > 0 && quantity <= (updatedCart[index].stockQuantity || 99)) {
        updatedCart[index].quantity = quantity;
        this.saveCart(updatedCart);
      } else if (quantity > (updatedCart[index].stockQuantity || 99)) {
        this.toastr.warning(`Chỉ còn ${updatedCart[index].stockQuantity || 99} sản phẩm trong kho`);
      }
    }
  }

  // Remove item from cart
  removeItem(index: number): void {
    const currentCart = this.getCartItems();

    if (index >= 0 && index < currentCart.length) {
      const updatedCart = currentCart.filter((_, i) => i !== index);
      this.saveCart(updatedCart);
      this.toastr.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  }

  // Remove multiple items from cart
  removeItems(indices: number[]): void {
    const currentCart = this.getCartItems();
    const updatedCart = currentCart.filter((_, index) => !indices.includes(index));
    this.saveCart(updatedCart);
    this.toastr.success('Đã xóa các sản phẩm đã chọn khỏi giỏ hàng');
  }

  // Toggle item selection
  toggleItemSelection(index: number): void {
    const currentCart = this.getCartItems();

    if (index >= 0 && index < currentCart.length) {
      const updatedCart = [...currentCart];
      updatedCart[index].selected = !updatedCart[index].selected;
      this.saveCart(updatedCart);
    }
  }

  // Select all items
  selectAllItems(selected: boolean): void {
    const currentCart = this.getCartItems();
    const updatedCart = currentCart.map(item => ({
      ...item,
      selected: selected
    }));
    this.saveCart(updatedCart);
  }

  // Check if all items are selected
  areAllItemsSelected(): boolean {
    const currentCart = this.getCartItems();
    return currentCart.length > 0 && currentCart.every(item => item.selected);
  }

  // Get cart summary
  getCartSummary(): CartSummary {
    const currentCart = this.getCartItems();
    const selectedItems = currentCart.filter(item => item.selected);

    const subtotal = selectedItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );

    // Calculate shipping fee (free for orders over 300,000 VND)
    const shippingFee = subtotal >= 300000 ? 0 : 20000;

    return {
      subtotal,
      shippingFee,
      discount: 0, // This would be calculated based on applied coupons
      total: subtotal + shippingFee,
      itemCount: selectedItems.length
    };
  }

  // Clear cart
  clearCart(): void {
    this.saveCart([]);
    this.toastr.info('Giỏ hàng đã được làm trống');
  }

  // Validate coupon code
  validateCoupon(code: string): Observable<Coupon | null> {
    // In a real app, this would call an API
    // For demo purposes, we'll return mock data
    const mockCoupons: { [key: string]: Coupon } = {
      'SAVE10': {
        code: 'SAVE10',
        discountType: 'PERCENT',
        discountValue: 10,
        minOrderValue: 100000,
        expiryDate: new Date('2025-12-31'),
        isActive: true
      },
      'FREESHIP': {
        code: 'FREESHIP',
        discountType: 'SHIPPING',
        discountValue: 100,
        minOrderValue: 0,
        expiryDate: new Date('2025-12-31'),
        isActive: true
      },
      'SUMMER50K': {
        code: 'SUMMER50K',
        discountType: 'FIXED',
        discountValue: 50000,
        minOrderValue: 200000,
        expiryDate: new Date('2025-12-31'),
        isActive: true
      }
    };

    const coupon = mockCoupons[code.toUpperCase()];

    if (coupon) {
      return of(coupon);
    } else {
      return of(null);
    }
  }

  // Apply coupon to cart
  applyCoupon(code: string, subtotal: number): Observable<{ discount: number, message: string }> {
    return this.validateCoupon(code).pipe(
      map(coupon => {
        if (!coupon) {
          return { discount: 0, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' };
        }

        if (!coupon.isActive) {
          return { discount: 0, message: 'Mã giảm giá đã hết hạn' };
        }

        if (subtotal < coupon.minOrderValue) {
          return {
            discount: 0,
            message: `Đơn hàng tối thiểu ${this.formatCurrency(coupon.minOrderValue)} để sử dụng mã này`
          };
        }

        let discount = 0;
        let message = '';

        switch (coupon.discountType) {
          case 'PERCENT':
            discount = Math.round(subtotal * (coupon.discountValue / 100));
            message = `Giảm ${coupon.discountValue}% đã được áp dụng!`;
            break;

          case 'FIXED':
            discount = coupon.discountValue;
            message = `Giảm ${this.formatCurrency(coupon.discountValue)} đã được áp dụng!`;
            break;

          case 'SHIPPING':
            discount = 20000; // Standard shipping fee
            message = 'Miễn phí vận chuyển đã được áp dụng!';
            break;
        }

        return { discount, message };
      }),
      catchError(error => {
        console.error('Error applying coupon', error);
        return of({ discount: 0, message: 'Đã xảy ra lỗi khi áp dụng mã giảm giá' });
      })
    );
  }

  // Create order
  createOrder(orderData: OrderRequest): Observable<any> {
    // In a real app, this would call an API
    // For demo purposes, we'll simulate a successful response
    return of({ success: true, orderId: 'ORD-' + Math.floor(Math.random() * 1000000) }).pipe(
      tap(response => {
        if (response.success) {
          // Remove checked out items from cart
          const currentCart = this.getCartItems();
          const updatedCart = currentCart.filter(item => !item.selected);
          this.saveCart(updatedCart);
        }
      }),
      delay(1500) // Simulate network delay
    );
  }

  // Format currency with Vietnamese format
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}

// Helper function to simulate delay
function delay(ms: number) {
  return (observable: Observable<any>) => new Observable(observer => {
    const subscription = observable.subscribe({
      next: (v) => setTimeout(() => observer.next(v), ms),
      error: (e) => setTimeout(() => observer.error(e), ms),
      complete: () => setTimeout(() => observer.complete(), ms)
    });

    return () => subscription.unsubscribe();
  });
}
