import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping, faInfoCircle, faTools, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {ApiResponse} from '../../models/api-response';
import {UserResponse} from '../../models/response/user-response';
import { UserService } from '../../services/user.service';


interface UserInfo {
  fullName: string;
  avatarUrl: string;
  email?: string;
  isVerified?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  // Font awesome icons
  faCartShopping = faCartShopping;
  faInfoCircle = faInfoCircle;
  faTools = faTools;
  faEnvelope = faEnvelope;

  // User information
  myInfo: UserInfo = {
    fullName: 'John Doe',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    isVerified: true
  };

  // Auth token (simulate storage)
  private authToken: string | null = null;

  constructor(private router: Router,
              private userService: UserService,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loadMyInfo();
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  loadMyInfo(): void{
    // Only try to load user info if user is logged in
    if (this.isLoggedIn()) {
      this.userService.getMyInfo().subscribe({
        next: (response: ApiResponse<UserResponse>) => {
          if (response && response.result) {
            this.myInfo = {
              fullName: response.result.fullName,
              avatarUrl: response.result.avatarUrl || 'https://i.pravatar.cc/150?img=12',
              email: response.result.email,
              isVerified: true
            };
          }
        },
        error: (error) => {
          console.error('Failed to fetch user info', error);
          // Keep default user info on error
        }
      });
    }
  }

  // Navigation methods
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
