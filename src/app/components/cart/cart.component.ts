import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping, faTrash, faMinus, faPlus, faArrowRight, faArrowLeft, faCartPlus } from '@fortawesome/free-solid-svg-icons';

interface CartItem {
  id: number;
  name: string;
  image: string;
  variant?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  selected: boolean;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  // Font Awesome icons
  faCartShopping = faCartShopping;
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faCartPlus = faCartPlus;

  // Cart items
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Sản phẩm mẫu 1',
      image: 'https://via.placeholder.com/100',
      variant: 'Đen, 128GB',
      price: 1000000,
      originalPrice: 1200000,
      quantity: 1,
      selected: false
    },
    {
      id: 2,
      name: 'Sản phẩm mẫu 2',
      image: 'https://via.placeholder.com/100',
      price: 500000,
      quantity: 2,
      selected: false
    }
  ];

  // Recommended products
  recommendedProducts: Product[] = [
    {
      id: 3,
      name: 'Sản phẩm đề xuất 1',
      image: 'https://via.placeholder.com/150',
      price: 750000,
      originalPrice: 900000
    },
    {
      id: 4,
      name: 'Sản phẩm đề xuất 2',
      image: 'https://via.placeholder.com/150',
      price: 300000
    }
  ];

  // Coupon and summary
  couponCode: string = '';
  couponMessage: string = '';
  discount: number = 0;
  shippingFee: number = 30000;

  get allItemsSelected(): boolean {
    return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  toggleSelectAll(): void {
    const allSelected = this.allItemsSelected;
    this.cartItems.forEach(item => (item.selected = !allSelected));
  }

  toggleSelectItem(index: number): void {
    this.cartItems[index].selected = !this.cartItems[index].selected;
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }

  selectedItemsCount(): number {
    return this.cartItems.filter(item => item.selected).length;
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
    // Simulate coupon validation
    if (this.couponCode.toLowerCase() === 'discount10') {
      this.discount = this.getSubtotal() * 0.1;
      this.couponMessage = 'Áp dụng mã giảm giá thành công!';
    } else {
      this.discount = 0;
      this.couponMessage = 'Mã giảm giá không hợp lệ';
    }
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        ...product,
        quantity: 1,
        selected: false
      });
    }
  }

  proceedToCheckout(): void {
    if (this.selectedItemsCount() > 0) {
      console.log('Proceeding to checkout with selected items:',
        this.cartItems.filter(item => item.selected));
      // Add navigation to checkout page or API call here
    }
  }
}
