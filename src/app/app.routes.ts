import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {CategoryComponent} from './components/category/category.component';
import {DetailProductComponent} from './components/detail-product/detail-product.component';
import {CartComponent} from './components/cart/cart.component';
import {LogInComponent} from './components/log-in/log-in.component';
import {AuthGuard} from './services/auth.guard';
import {AccountManagementComponent} from './components/account-management/account-management.component';
import {ShopComponent} from './components/shop/shop.component';
// import {LogInComponent} from './components/log-in/log-in.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Trang chủ
  { path: 'category/:categoryId', component: CategoryComponent },
  { path: 'detail-product/:productId', component: DetailProductComponent },
  { path: 'shop' ,component: ShopComponent },
  { path: 'login', component : LogInComponent },
  { path: 'profile', component: AccountManagementComponent},
  { path: 'cart', component: CartComponent },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component')
      .then(m => m.CartComponent),
    canActivate: [AuthGuard] }
];
