import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../models/api-response';
import {AuthenticationRequest} from '../models/authentication-request';
import {AuthenticationResponse} from '../models/response/authentication-response';
import {UserResponse} from '../models/response/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl ="http://localhost:8080/api/auth"
  private baseUrl2 ="http://localhost:8080/api/users"

  constructor(private httpClient: HttpClient) { }

  login(credentials: AuthenticationRequest): Observable<ApiResponse<AuthenticationResponse>> {
    return this.httpClient.post<ApiResponse<AuthenticationResponse>>(this.baseUrl + '/token', credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getMyInfo(): Observable<ApiResponse<UserResponse>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found. User is not authenticated.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<ApiResponse<UserResponse>>(`${this.baseUrl2}/myInfo`, { headers });
  }

  // getUserProfile(): Observable<UserResponse> {
  //   const headers = this.getAuthHeaders();
  //   return this.httpClient.get<User>(`${this.baseUrl2}/profile`, { headers });
  // }
  //
  // getUserOrders(pageNumber: number, pageSize: number): Observable<{ result: Order[], totalPages: number }> {
  //   const headers = this.getAuthHeaders();
  //   return this.httpClient.get<{ result: Order[], totalPages: number }>(
  //     `${this.baseUrl2}/orders?page=${pageNumber}&size=${pageSize}`, { headers }
  //   );
  // }

}
