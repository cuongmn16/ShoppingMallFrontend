import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface JwtPayload {
  username?: string;
  preferred_username?: string;
  email?: string;
  exp?: number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  /** Check if localStorage is available */
  private hasLocalStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  /** Check if logged in & token is valid */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return !payload.exp || payload.exp > now;
    } catch {
      return false;
    }
  }

  /** Get raw JWT (or null) */
  getToken(): string | null {
    if (this.hasLocalStorage()) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /** Decode JWT payload; return {} if error */
  private decodeToken(): JwtPayload {
    const token = this.getToken();
    if (!token) return {};
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }

  getCurrentUsername(): string | null {
    const p = this.decodeToken();
    return (
      p['username'] ??
      p['preferred_username'] ??
      p['email'] ??
      p['sub'] ??
      null
    );
  }

  /** Call login API, save accessToken to localStorage */
  login(username: string, password: string) {
    return this.http
      .post<{ accessToken: string }>('/api/auth/token', { username, password })
      .pipe(
        tap(res => {
          if (this.hasLocalStorage()) {
            localStorage.setItem(this.TOKEN_KEY, res.accessToken);
          }
        })
      );
  }

  logout(): void {
    if (this.hasLocalStorage()) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}
