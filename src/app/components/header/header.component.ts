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

  myInfo!: UserResponse;
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
    this.userService.getMyInfo().subscribe({
      next: (response: ApiResponse<UserResponse>) => {
        this.myInfo = response.result;
      },
      error: (error) => {
        console.error('Failed to fetch user info', error);
      }
    });
  }
}
