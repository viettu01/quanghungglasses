export class PaginationDTO<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  pageSize: number;
  pageNumber: number;
  firstElementOnPage: number; // Số thứ tự phần tử đầu tiên trên trang hiện tại
  lastElementOnPage: number; // Số thứ tự phần tử cuối cùng trên trang hiện tại

  constructor(content: T[], totalPages: number, totalElements: number, numberOfElements: number, pageSize: number,
              pageNumber: number, firstElementOnPage: number, lastElementOnPage: number) {
    this.content = content;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.numberOfElements = numberOfElements;
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    this.firstElementOnPage = firstElementOnPage;
    this.lastElementOnPage = lastElementOnPage;
  }
}
