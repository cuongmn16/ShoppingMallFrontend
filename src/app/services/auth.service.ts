import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';   // 🔑 dùng 1 khóa duy nhất

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return !payload.exp || payload.exp > now;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string) {
    return this.http
      .post<{ accessToken: string }>('/api/auth/token', { username, password })
      .pipe(tap(res => localStorage.setItem(this.TOKEN_KEY, res.accessToken)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
