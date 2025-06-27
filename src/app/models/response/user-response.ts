export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phone : number;
  avatarUrl: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  // thêm các trường khác nếu cần
}
