export class ProductReport {
  id: number;
  name: string;
  color: string;
  totalQuantity: number; // Số lượng đã bán / đã nhập / tồn kho
  totalMoney: number; // Tổng tiền đã bán / đã nhập

  constructor(id: number, name: string, color: string, totalQuantity: number, totalMoney: number) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.totalQuantity = totalQuantity;
    this.totalMoney = totalMoney;
  }
}
