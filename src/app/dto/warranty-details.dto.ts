export class WarrantyDetailsDto {
  id: number;
  orderId: number; // id đơn hàng
  productDetailsId: number; // id chi tiết sản phẩm
  productName: string; // tên sản phẩm
  productColor: string; // màu sắc sản phẩm
  productQuantitySellInOrder: number; // số lượng bán trong đơn hàng
  productPriceSellInOrder: number; // giá bán trong đơn hàng
  quantity: number; // số lượng sản phẩm cần bảo hành
  cost: number; // chi phí bảo hành
  warrantyType: number; // 0: Đổi, 1: Sửa

  constructor(id: number, orderId: number, productDetailsId: number, productName: string, productColor: string, productQuantitySellInOrder: number, productPriceSellInOrder: number, quantity: number, cost: number, warrantyType: number) {
    this.id = id;
    this.orderId = orderId;
    this.productDetailsId = productDetailsId;
    this.productName = productName;
    this.productColor = productColor;
    this.productQuantitySellInOrder = productQuantitySellInOrder;
    this.productPriceSellInOrder = productPriceSellInOrder;
    this.quantity = quantity;
    this.cost = cost;
    this.warrantyType = warrantyType;
  }
}
