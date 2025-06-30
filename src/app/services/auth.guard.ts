// src/app/services/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) return true;
    /* chuyển sang /log-in và nhớ đường dẫn gốc */
    this.router.navigate(['/log-in'], { queryParams: { returnUrl: '/cart' } });
    return false;
  }
}
