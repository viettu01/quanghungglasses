export class Dashboard {
  totalOrderInDay: number;
  totalOrderOnHold: number;
  totalOrderCompleted: number;
  totalProductOutOfStock: number;
  totalProductSold: number;
  totalCustomerNew: number;

  constructor(totalOrderInDay: number, totalOrderOnHold: number, totalOrderCompleted: number, totalProductOutOfStock: number, totalProductSold: number, totalCustomerNew: number) {
    this.totalOrderInDay = totalOrderInDay;
    this.totalOrderOnHold = totalOrderOnHold;
    this.totalOrderCompleted = totalOrderCompleted;
    this.totalProductOutOfStock = totalProductOutOfStock;
    this.totalProductSold = totalProductSold;
    this.totalCustomerNew = totalCustomerNew;
  }

  static createEmpty(): Dashboard {
    return new Dashboard(0, 0, 0, 0, 0, 0);
  }
}
