import {ProductReport} from "./product-report";

export class ReceiptReport {
  month: number; // Tháng
  year: number; // Năm
  totalQuantityReceipt: number; // Tổng sản phẩm đã bán
  totalMoneyReceipt: number; // Tổng tiền bán
  products: ProductReport[]; // Danh sách sản phẩm

  constructor(month: number, year: number, totalQuantityReceipt: number, totalMoneyReceipt: number, products: ProductReport[]) {
    this.month = month;
    this.year = year;
    this.totalQuantityReceipt = totalQuantityReceipt;
    this.totalMoneyReceipt = totalMoneyReceipt;
    this.products = products;
  }
}
