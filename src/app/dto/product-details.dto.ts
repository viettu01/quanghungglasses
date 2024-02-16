import {BaseDto} from "./base.dto";

export class ProductDetailsDto extends BaseDto {
  id: number;
  color: string;
  images: string[];

  constructor(createdDate: Date, updatedDate: Date, id: number, color: string, images: string[]) {
    super(createdDate, updatedDate);
    this.id = id;
    this.color = color;
    this.images = images;
  }
}
