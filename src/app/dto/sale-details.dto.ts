export class SaleDetailsDto {
  id: number;
  productId: number;
  discount: number;

  constructor(id: number, productId: number, discount: number) {
    this.id = id;
    this.productId = productId;
    this.discount = discount;
  }
}
