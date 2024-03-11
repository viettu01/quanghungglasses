import {BaseDto} from "./base.dto";

export class ProductDetailsDto extends BaseDto {
  id: number;
  color: string;
  quantity: number;

  constructor(createdDate: Date, updatedDate: Date, id: number, color: string, quantity: number) {
    super(createdDate, updatedDate);
    this.id = id;
    this.color = color;
    this.quantity = quantity;
  }

  static createEmpty(): ProductDetailsDto {
    return new ProductDetailsDto(new Date(), new Date(), 0, "", 0);
  }
}
