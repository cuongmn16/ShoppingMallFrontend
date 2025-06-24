import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Router, RouterLink, RouterModule} from '@angular/router';
import {UserResponse} from '../../models/response/user-response';
import {UserService} from '../../services/user.service';
import {ApiResponse} from '../../models/api-response';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule,RouterLink ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
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
