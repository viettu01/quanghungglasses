import {BaseDto} from "./base.dto";

export class CategoryDto extends BaseDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  totalProduct: number;
  status: boolean;

  constructor(id: number, name: string, slug: string, description: string, totalProduct: number, status: boolean, createdDate: Date, updatedDate: Date) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.totalProduct = totalProduct;
    this.status = status;
  }

  static createEmpty(): CategoryDto {
    return new CategoryDto(0, "", "", "", 0, false, new Date(), new Date());
  }
}
