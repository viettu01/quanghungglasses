import {BaseDto} from "./base.dto";

export class CartDto extends BaseDto {
  id: number;
  productDetailsId: number;
  productDetailsThumbnails: string;
  productName: string;
  productSlug: string;
  productColor: string;
  productPrice: number;
  quantity: number;
  quantityInStock: number;
  isSelected: boolean = false;
  btnPlusDisabled: boolean = false;
  btnMinusDisabled: boolean = false;
  inputQuantityDisabled: boolean = false;


  constructor(createdDate: Date, updatedDate: Date, id: number, productDetailsId: number, productDetailsThumbnails: string, productName: string, productSlug: string, productColor: string, productPrice: number, quantity: number, quantityInStock: number) {
    super(createdDate, updatedDate);
    this.id = id;
    this.productDetailsId = productDetailsId;
    this.productDetailsThumbnails = productDetailsThumbnails;
    this.productName = productName;
    this.productSlug = productSlug;
    this.productColor = productColor;
    this.productPrice = productPrice;
    this.quantity = quantity;
    this.quantityInStock = quantityInStock;
  }

  static createEmpty(): CartDto {
    return new CartDto(new Date(), new Date(), 0, 0, '', '', '', '', 0, 0, 0);
  }
}
