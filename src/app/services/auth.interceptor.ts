// src/app/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

const API_ROOT = 'http://localhost:8080/api';   // đổi theo backend của bạn

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Chỉ can thiệp nếu request tới API backend
  if (!req.url.startsWith(API_ROOT)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();        // đọc token từ LocalStorage

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
