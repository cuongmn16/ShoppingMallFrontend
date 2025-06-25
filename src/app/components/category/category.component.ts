import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Product} from '../../models/product';
import {ActivatedRoute, Router} from '@angular/router';
import {HomeService} from '../../services/home.service';
import {CommonModule} from '@angular/common';
import {Category} from '../../models/category';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  // Basic properties
  categoryId!: number;
  categories: Category[] = [];
  products: Product[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  // Category slider properties
  currentSlide = 0;
  maxSlides = 0;
  slideDots: number[] = [];
  visibleCategories: Category[] = [];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('categoryId')!;
    if (this.categoryId) {
      this.loadProducts();
      this.loadChildCategories();
    } else {
      this.error = 'Invalid category ID.';
    }
  }

  loadChildCategories(): void {
    this.homeService.getCategoriesByParentId(this.categoryId).subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.updateSliderProperties();
      },
      error: (error) => {
        console.error('Error fetching child categories:', error);
      }
    });
  }

  updateSliderProperties(): void {
    // Calculate how many total slides we need (each slide shows 10 categories - 5 per row)
    this.maxSlides = Math.max(0, Math.ceil(this.categories.length / 10) - 1);

    // Create dots array for pagination
    this.slideDots = Array(this.maxSlides + 1).fill(0).map((_, i) => i);

    // Initialize visible categories
    this.updateVisibleCategories();
  }


  updateVisibleCategories(): void {
    const startIndex = this.currentSlide * 10;
    const endIndex = startIndex + 10;
    this.visibleCategories = this.categories.slice(startIndex, endIndex);

  }

  loadProducts(pageNumber: number = this.pageNumber): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = null;
    this.pageNumber = pageNumber;

    this.homeService
      .getAllProductsByCategory(this.categoryId, this.pageNumber, this.pageSize)
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

  // Category slider methods
  slidePrev(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateVisibleCategories();
    }
  }

  slideNext(): void {
    if (this.currentSlide < this.maxSlides) {
      this.currentSlide++;
      this.updateVisibleCategories();
    }
  }

  goToSlide(slideIndex: number): void {
    this.currentSlide = slideIndex;
    this.updateVisibleCategories();
  }

  // Pagination methods
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

  // Helper methods
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

  navigateToDetailProduct(productId: number): void {
    this.router.navigate(['/detail-product', productId]);
  }

  // Clean up subscriptions
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
