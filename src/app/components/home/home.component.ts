import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {HomeService} from '../../services/home.service';
import {Category} from '../../models/category';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {Product} from '../../models/product';
import {Subject, takeUntil} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit,OnDestroy  {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient
  ) { }
  categories : Category[] = [];
  products : Product[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1; // Default to 1, updated based on API response
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getAllCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllCategories(): void {
    this.homeService.getRootCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching root categories:', error);
      }
    );
  }


  loadProducts(pageNumber = this.pageNumber): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = null;
    this.pageNumber = pageNumber;

    this.homeService
      .getAllProducts(this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products   = products;                     // mảng thuần
          this.totalPages = this.estimateTotalPages(products.length);
          this.isLoading  = false;
        },
        error: (err) => {
          this.error = 'Failed to load products, try again.';
          console.error(err);
          this.isLoading = false;
        }
      });
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.pageNumber) {
      this.loadProducts(page);
    }
  }

  previousPage(): void {
    this.goToPage(this.pageNumber - 1);
  }

  nextPage(): void {
    this.goToPage(this.pageNumber + 1);
  }

  estimateTotalPages(resultLength: number): number {
    // Fallback if totalPages is not provided by backend
    return resultLength < this.pageSize ? this.pageNumber : this.pageNumber + 1;
  }

  get pageNumbers(): number[] {
    // Generate array of page numbers for pagination controls
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  trackById(index: number, product: Product): number {
    return product.productId;
  }

  selectCategory(categoryId: number): void {
    this.router.navigate(['/category', categoryId]);
  }

  NavigateToDetailProduct(productId: number){
    this.router.navigate((['/detail-product', productId]));
  }

  getCategoriesByParentId(parentId: number) {
    return this.http.get<Category[]>(`/api/categories/parent/${parentId}`);
  }

}
