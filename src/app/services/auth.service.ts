import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';      // 🔑 khóa lưu JWT

  constructor(private http: HttpClient) {}

  /** Kiểm tra đã đăng nhập & token còn hạn */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return !payload.exp || payload.exp > now;
    } catch {
      return false; // token hỏng format
    }
  }

  /** Lấy JWT thô (hoặc null) */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Lấy userId trong payload JWT; null nếu chưa đăng nhập */
  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // tuỳ thuộc backend: thường là 'userId' hoặc 'sub'
      return payload.userId ?? payload.sub ?? null;
    } catch {
      return null;
    }
  }

  /** Gọi API login, lưu accessToken vào localStorage */
  login(username: string, password: string) {
    return this.http
      .post<{ accessToken: string }>('/api/auth/token', { username, password })
      .pipe(tap(res => localStorage.setItem(this.TOKEN_KEY, res.accessToken)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
