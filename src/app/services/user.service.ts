import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { UserResponse } from '../models/response/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users'; // Update this with your actual API URL

  constructor(private http: HttpClient) { }

  /**
   * Get current user information
   * @returns Observable with user data
   */
  getMyInfo(): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/me`);
  }
}
