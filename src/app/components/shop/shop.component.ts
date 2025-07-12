import {Component, OnDestroy, OnInit} from '@angular/core';
import {interval, Subject, takeUntil} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CommonModule} from '@angular/common';


// Interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  sold: number;
  location: string;
  category: string;
  discount?: number;
  salePrice?: number;
  isFavorite?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface CountdownTime {
  hours: string;
  minutes: string;
  seconds: string;
}
@Component({
  selector: 'app-shop',
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})

export class ShopComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data properties
  products: Product[] = [];
  flashSaleProducts: Product[] = [];
  filteredProducts: Product[] = [];
  cartItems: CartItem[] = [];
  categories: Category[] = [];
  featuredCategories: Category[] = [];
  banners: Banner[] = [];

  // UI state
  isCartOpen = false;
  selectedCategory = 'all';
  searchQuery = '';
  sortBy = 'popular';
  hasMoreProducts = true;
  currentBanner = 0;
  currentPage = 1;
  itemsPerPage = 20;

  // Flash sale countdown
  flashSaleCountdown: CountdownTime = {
    hours: '00',
    minutes: '00',
    seconds: '00'
  };

  constructor() {}

  ngOnInit(): void {
    this.initializeData();
    this.startFlashSaleCountdown();
    this.startBannerSlider();
    this.filterProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialize sample data
  private initializeData(): void {
    // Categories
    this.categories = [
      { id: 'all', name: 'Tất cả', icon: 'fas fa-th' },
      { id: 'electronics', name: 'Điện tử', icon: 'fas fa-laptop' },
      { id: 'fashion', name: 'Thời trang', icon: 'fas fa-tshirt' },
      { id: 'home', name: 'Nhà cửa', icon: 'fas fa-home' },
      { id: 'sports', name: 'Thể thao', icon: 'fas fa-dumbbell' },
      { id: 'books', name: 'Sách', icon: 'fas fa-book' }
    ];

    this.featuredCategories = [
      { id: 'electronics', name: 'Điện tử', icon: 'fas fa-laptop' },
      { id: 'fashion', name: 'Thời trang', icon: 'fas fa-tshirt' },
      { id: 'home', name: 'Nhà cửa', icon: 'fas fa-home' },
      { id: 'sports', name: 'Thể thao', icon: 'fas fa-dumbbell' },
      { id: 'books', name: 'Sách', icon: 'fas fa-book' },
      { id: 'beauty', name: 'Làm đẹp', icon: 'fas fa-heart' },
      { id: 'food', name: 'Thực phẩm', icon: 'fas fa-utensils' },
      { id: 'toys', name: 'Đồ chơi', icon: 'fas fa-gamepad' }
    ];

    // Banners
    this.banners = [
      {
        id: 1,
        title: 'Siêu Sale 12.12',
        description: 'Giảm giá lên đến 50% cho tất cả sản phẩm',
        image: 'https://via.placeholder.com/600x300/667eea/ffffff?text=Banner+1'
      },
      {
        id: 2,
        title: 'Flash Sale hôm nay',
        description: 'Cơ hội cuối để sở hữu những sản phẩm hot',
        image: 'https://via.placeholder.com/600x300/764ba2/ffffff?text=Banner+2'
      },
      {
        id: 3,
        title: 'Miễn phí vận chuyển',
        description: 'Áp dụng cho đơn hàng từ 200k',
        image: 'https://via.placeholder.com/600x300/f093fb/ffffff?text=Banner+3'
      }
    ];

    // Sample products
    this.products = this.generateSampleProducts();
    this.flashSaleProducts = this.products.filter(p => p.discount && p.discount > 30).slice(0, 6);
  }

  private generateSampleProducts(): Product[] {
    const sampleProducts: Product[] = [];
    const categories = ['electronics', 'fashion', 'home', 'sports', 'books'];
    const locations = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];

    for (let i = 1; i <= 100; i++) {
      const originalPrice = Math.floor(Math.random() * 1000000) + 100000;
      const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : 0;
      const salePrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

      sampleProducts.push({
        id: i,
        name: `Sản phẩm ${i} - Chất lượng cao, giá tốt nhất thị trường`,
        price: salePrice,
        originalPrice: discount > 0 ? originalPrice : undefined,
        image: `https://via.placeholder.com/250x200/f0f0f0/666666?text=Product+${i}`,
        rating: Math.floor(Math.random() * 5) + 1,
        reviews: Math.floor(Math.random() * 1000) + 10,
        sold: Math.floor(Math.random() * 5000) + 100,
        location: locations[Math.floor(Math.random() * locations.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        discount,
        salePrice: discount > 0 ? salePrice : undefined,
        isFavorite: false
      });
    }

    return sampleProducts;
  }

  // Flash sale countdown
  private startFlashSaleCountdown(): void {
    // Set flash sale end time (24 hours from now)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);

    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft > 0) {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          this.flashSaleCountdown = {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0')
          };
        } else {
          this.flashSaleCountdown = {
            hours: '00',
            minutes: '00',
            seconds: '00'
          };
        }
      });
  }

  // Banner slider
  private startBannerSlider(): void {
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentBanner = (this.currentBanner + 1) % this.banners.length;
      });
  }

  // Search functionality
  searchProducts(): void {
    this.filterProducts();
  }

  // Filter products
  filterProducts(): void {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

    // Sort products
    this.sortFilteredProducts(filtered);

    // Paginate
    this.paginateProducts(filtered);
  }

  // Sort products
  sortProducts(): void {
    this.filterProducts();
  }

  private sortFilteredProducts(products: Product[]): void {
    switch (this.sortBy) {
      case 'popular':
        products.sort((a, b) => b.sold - a.sold);
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        products.sort((a, b) => b.sold - a.sold);
    }
  }

  // Pagination
  private paginateProducts(products: Product[]): void {
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    this.filteredProducts = products.slice(startIndex, endIndex);
    this.hasMoreProducts = endIndex < products.length;
  }

  loadMoreProducts(): void {
    this.currentPage++;
    this.filterProducts();
  }

  // Category filtering
  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.filterProducts();
  }

  // Product actions
  viewProduct(product: Product): void {
    console.log('Viewing product:', product);
    // Navigate to product detail page
    // this.router.navigate(['/product', product.id]);
  }

  toggleFavorite(product: Product, event: Event): void {
    event.stopPropagation();
    product.isFavorite = !product.isFavorite;

    if (product.isFavorite) {
      this.showToast('Đã thêm vào danh sách yêu thích');
    } else {
      this.showToast('Đã xóa khỏi danh sách yêu thích');
    }
  }

  quickView(product: Product, event: Event): void {
    event.stopPropagation();
    console.log('Quick view:', product);
    // Open quick view modal
    this.showToast('Tính năng xem nhanh đang được phát triển');
  }

  // Cart functionality
  addToCart(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity: 1
      };
      this.cartItems.push(cartItem);
    }

    this.showToast('Đã thêm sản phẩm vào giỏ hàng');
  }

  removeFromCart(item: CartItem): void {
    const index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.showToast('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  }

  updateQuantity(item: CartItem, change: number): void {
    item.quantity += change;

    if (item.quantity <= 0) {
      this.removeFromCart(item);
    }
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  // Helper methods
  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  private showToast(message: string): void {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Utility methods for number formatting
  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

  // Performance optimization
  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  trackByBannerId(index: number, banner: Banner): number {
    return banner.id;
  }

  trackByCartItemId(index: number, item: CartItem): number {
    return item.id;
  }

  // Responsive helper
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  // Scroll to top
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Clear filters
  clearFilters(): void {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.sortBy = 'popular';
    this.currentPage = 1;
    this.filterProducts();
  }

  // Get filtered products count
  getFilteredProductsCount(): number {
    let count = this.products.length;

    if (this.selectedCategory !== 'all') {
      count = this.products.filter(p => p.category === this.selectedCategory).length;
    }

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      count = this.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      ).length;
    }

    return count;
  }

  // Check if product is in cart
  isInCart(product: Product): boolean {
    return this.cartItems.some(item => item.id === product.id);
  }

  // Get cart item count for specific product
  getCartItemCount(product: Product): number {
    const item = this.cartItems.find(item => item.id === product.id);
    return item ? item.quantity : 0;
  }

  // Calculate discount percentage
  calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  }

  // Check if product is on sale
  isOnSale(product: Product): boolean {
    return product.originalPrice !== undefined && product.originalPrice > product.price;
  }

  // Get sale badge text
  getSaleBadgeText(product: Product): string {
    if (this.isOnSale(product)) {
      const discount = this.calculateDiscountPercentage(product.originalPrice!, product.price);
      return `-${discount}%`;
    }
    return '';
  }
}
