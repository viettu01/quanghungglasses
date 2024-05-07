export class OrderDetailsDto {
  id: number;
  productDetailsId: number;
  quantity: number;
  price: number;
  priceOriginal: number = 0;

  productName: string = '';
  productColor: string = '';
  productThumbnail: string = '';
  totalMoney: number = 0;

  productTimeWarranty: number = 0;

  constructor(id: number, productDetailsId: number, quantity: number, price: number) {
    this.id = id;
    this.productDetailsId = productDetailsId;
    this.quantity = quantity;
    this.price = price;
  }

  static createEmpty(): OrderDetailsDto {
    return new OrderDetailsDto(0, 0, 0, 0);
  }
}
