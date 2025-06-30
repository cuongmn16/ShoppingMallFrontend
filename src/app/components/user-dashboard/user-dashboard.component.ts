// import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Subject, takeUntil } from 'rxjs';
// import { ToastrModule, ToastrService } from 'ngx-toastr';
// import { UserService } from '../../services/user.service';
// import { Product } from '../../models/product';
// import { Order } from '../../models/order';
// import { User } from '../../models/response/user-response';
//
// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, ToastrModule],
//   templateUrl: './user-dashboard.component.html',
//   styleUrls: ['./user-dashboard.component.scss']
// })
// export class UserDashboardComponent implements OnInit, OnDestroy {
//   user: User | null = null;
//   orders: Order[] = [];
//   wishlist: Product[] = [];
//   orderPageNumber = 1;
//   wishlistPageNumber = 1;
//   pageSize = 10;
//   totalOrderPages = 1;
//   totalWishlistPages = 1;
//   isLoadingUser = false;
//   isLoadingOrders = false;
//   isLoadingWishlist = false;
//   private destroy$ = new Subject<void>();
//
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private router: Router,
//     private userService: UserService,
//     private toastr: ToastrService
//   ) {}
//
//   ngOnInit(): void {
//     this.loadUserProfile();
//     this.loadOrders();
//     this.loadWishlist();
//   }
//
//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
//
//   loadUserProfile(): void {
//     this.isLoadingUser = true;
//
//     this.userService.getUserProfile()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           this.user = response.data; // hoặc response.result tùy API
//           this.isLoadingUser = false;
//           this.toastr.success('Tải hồ sơ thành công', 'Thông báo', { timeOut: 2000 });
//         },
//         error: (error: any) => {
//           this.toastr.error(error.error?.message || 'Tải hồ sơ thất bại', 'Lỗi', { timeOut: 2000 });
//           this.isLoadingUser = false;
//         }
//       });
//   }
//
//   loadOrders(pageNumber: number = this.orderPageNumber): void {
//     if (this.isLoadingOrders) return;
//
//     this.isLoadingOrders = true;
//
//     this.userService.getUserOrders(this.orderPageNumber, this.pageSize)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (response: any) => {
//           this.orders = response.result;
//           this.totalOrderPages = response.totalPages || this.estimateTotalPages(response.result.length);
//           this.isLoadingOrders = false;
//         },
//         error: (error: any) => {
//           this.toastr.error(error.error?.message || 'Tải đơn hàng thất bại', 'Lỗi', { timeOut: 2000 });
//           this.isLoadingOrders = false;
//         }
//       });
//   }
//
//   // loadWishlist(pageNumber: number = this.wishlistPageNumber): void {
//   //   if (this.isLoadingWishlist) return;
//   //
//   //   this.isLoadingWishlist = true;
//   //
//   //   this.userService.getWishlist(this.wishlistPageNumber, this.pageSize)
//   //     .pipe(takeUntil(this.destroy$))
//   //     .subscribe({
//   //       next: (response: any) => {
//   //         this.wishlist = response.result;
//   //         this.totalWishlistPages = response.totalPages || this.estimateTotalPages(response.result.length);
//   //         this.isLoadingWishlist = false;
//   //       },
//   //       error: (error: any) => {
//   //         this.toastr.error(error.error?.message || 'Tải danh sách yêu thích thất bại', 'Lỗi', { timeOut: 2000 });
//   //         this.isLoadingWishlist = false;
//   //       }
//   //     });
//   // }
//
//   // removeFromWishlist(event: Event, productId: number): void {
//   //   event.stopPropagation();
//   //   this.userService.removeFromWishlist(productId)
//   //     .pipe(takeUntil(this.destroy$))
//   //     .subscribe({
//   //       next: () => {
//   //         this.wishlist = this.wishlist.filter(product => product.productId !== productId);
//   //         this.toastr.success('Đã xóa sản phẩm khỏi danh sách yêu thích', 'Thành công', { timeOut: 2000 });
//   //       },
//   //       error: (error: any) => {
//   //         this.toastr.error(error.error?.message || 'Xóa sản phẩm thất bại', 'Lỗi', { timeOut: 2000 });
//   //       }
//   //     });
//   }
//
//   goToOrderPage(page: number): void {
//     if (page >= 1 && page <= this.totalOrderPages && page !== this.orderPageNumber) {
//       this.orderPageNumber = page;
//       this.loadOrders(page);
//     }
//   }
//
//   goToWishlistPage(page: number): void {
//     if (page >= 1 && page <= this.totalWishlistPages && page !== this.wishlistPageNumber) {
//       this.wishlistPageNumber = page;
//       this.loadWishlist(page);
//     }
//   }
//
//   previousOrderPage(): void {
//     this.goToOrderPage(this.orderPageNumber - 1);
//   }
//
//   nextOrderPage(): void {
//     this.goToOrderPage(this.orderPageNumber + 1);
//   }
//
//   previousWishlistPage(): void {
//     this.goToWishlistPage(this.wishlistPageNumber - 1);
//   }
//
//   nextWishlistPage(): void {
//     this.goToWishlistPage(this.wishlistPageNumber + 1);
//   }
//
//   estimateTotalPages(resultLength: number): number {
//     return resultLength < this.pageSize ? this.orderPageNumber : this.orderPageNumber + 1;
//   }
//
//   get orderPageNumbers(): number[] {
//     return Array.from({ length: this.totalOrderPages }, (_, i) => i + 1);
//   }
//
//   get wishlistPageNumbers(): number[] {
//     return Array.from({ length: this.totalWishlistPages }, (_, i) => i + 1);
//   }
//
//   trackByOrderId(index: number, order: Order): number {
//     // Use the correct property name for your Order model, e.g., id instead of orderId
//     return (order as any).orderId ?? (order as any).id;
//   }
//
//   trackByProductId(index: number, product: Product): number {
//     return product.productId;
//   }
//
//   navigateToEditProfile(): void {
//     this.router.navigate(['/edit-profile']);
//   }
//
//   navigateToChangePassword(): void {
//     this.router.navigate(['/change-password']);
//   }
//
//   navigateToOrderDetail(orderId: number): void {
//     this.router.navigate(['/order', orderId]);
//   }
//
//   navigateToProductDetail(productId: number): void {
//     this.router.navigate(['/detail-product', productId]);
//   }
// }
