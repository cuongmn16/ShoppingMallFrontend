import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {CategoryComponent} from './components/category/category.component';
import {DetailProductComponent} from './components/detail-product/detail-product.component';
import {LogInComponent} from './components/log-in/log-in.component';


export const routes: Routes = [
  { path: '', component: HomeComponent }, // Trang chủ
  { path: 'category/:categoryId', component: CategoryComponent },
  { path: 'detail-product/:productId', component: DetailProductComponent },
  { path: 'login', component : LogInComponent}
];
