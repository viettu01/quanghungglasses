import {ProductDetailsDto} from "./product-details.dto";

export class ReceiptDetailsDto {
  id: number;
  quantity: number; // số lượng thực nhập
  price: number;
  productDetailsId: number;
  productDetails: ProductDetailsDto[];

  constructor(id: number, quantity: number, price: number, productDetailsId: number, productDetails: ProductDetailsDto[]) {
    this.id = id;
    this.quantity = quantity;
    this.price = price;
    this.productDetailsId = productDetailsId;
    this.productDetails = productDetails;
  }
}
