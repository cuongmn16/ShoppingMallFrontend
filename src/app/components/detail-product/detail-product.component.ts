import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {HomeService} from '../../services/home.service';
import {ProductDetail, ProductVariation} from '../../models/detail-product';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})
export class DetailProductComponent implements OnInit {
  constructor(private router: Router, private routeActivate: ActivatedRoute, private homeService: HomeService  ) { }
  productId!: number;
  productDetail! : ProductDetail;
  selectedVariation: ProductVariation | null = null;

  ngOnInit(): void {
    this.loadDetailProduct()
  }

  loadDetailProduct(): void {
    this.productId = +this.routeActivate.snapshot.paramMap.get('productId')!;
    if (this.productId) {
      this.homeService.getProductDetail(this.productId).subscribe({
        next: (response) => {
          this.productDetail = response.result;
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
        }
      });
    } else {
      console.error('Invalid product ID.');
    }
  }

  getAttributeValues(attributeName: string): string[] {
    const attribute = this.productDetail?.productAttributes.find(
      attr => attr.attributeName.toLowerCase() === attributeName.toLowerCase());
    return attribute ? attribute.attributeValue.split(', ').map(val => val.trim()) : [];
  }


}
