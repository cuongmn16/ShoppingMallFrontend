import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Product} from '../../models/product';
import {ActivatedRoute, Router} from '@angular/router';
import {HomeService} from '../../services/home.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit{
  constructor(private router: Router, private homeService: HomeService,
  private route : ActivatedRoute) { }
  categoryId!: number;
  products : Product[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();


  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('categoryId')!;
    if (this.categoryId) {
      this.loadProducts();
    } else {
      this.error = 'Invalid category ID.';
    }

  }

  loadProducts(pageNumber: number = this.pageNumber): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = null;
    this.pageNumber = pageNumber;

    this.homeService
      .getAllProductsByCategory(this.categoryId,this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.products = response.result; // Replace products for the current page
          this.totalPages = response.totalPages || this.estimateTotalPages(response.result.length);
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Failed to load products. Please try again.';
          console.error('Error fetching products:', error);
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

  navigateToDetailProduct(productId: number): void {
    this.router.navigate(['/detail-product', productId]);
  }


}
