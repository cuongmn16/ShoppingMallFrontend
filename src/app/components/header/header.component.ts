import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping, faInfoCircle, faTools, faEnvelope } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  faCartShopping = faCartShopping;
  faInfoCircle = faInfoCircle;
  faTools = faTools;
  faEnvelope = faEnvelope;

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToAbout(): void {
    this.router.navigate(['/about']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }

  navigateToService(): void {
    this.router.navigate(['/services']);
  }

}
