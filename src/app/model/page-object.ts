export interface PageObject<T> {
  data: T[];
  totalRecords: number;
  page: number;
  totalPages: number;
}
