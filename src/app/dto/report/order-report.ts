import {ProductReport} from "./product-report";

export class OrderReport {
  month: number; // Tháng
  year: number; // Năm
  totalQuantityOrder: number; // Tổng sản phẩm đã bán
  totalMoneyOrder: number; // Tổng tiền bán
  products: ProductReport[]; // Danh sách sản phẩm

  constructor(month: number, year: number, totalQuantityOrder: number, totalMoneyOrder: number, products: ProductReport[]) {
    this.month = month;
    this.year = year;
    this.totalQuantityOrder = totalQuantityOrder;
    this.totalMoneyOrder = totalMoneyOrder;
    this.products = products;
  }
}
