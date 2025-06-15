import { Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {CategoryComponent} from './components/category/category.component';


export const routes: Routes = [
  { path: ' ', component: HomeComponent }, // Trang chủ
  { path: 'category/:categoryId', component: CategoryComponent },
];
