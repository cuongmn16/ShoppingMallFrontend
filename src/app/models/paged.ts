export interface Paged<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
}
