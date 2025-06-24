export interface ApiResponse<T> {
  code : number;
  message: String;
  result: T;

}
