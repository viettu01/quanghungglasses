import {BaseDto} from "./base.dto";
import {ProductDto} from "./product.dto";

export class CategoryProductDto extends BaseDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  products: ProductDto[];
  status: boolean;

  constructor(createdDate: Date, updatedDate: Date, id: number, name: string, slug: string, description: string, products: ProductDto[], status: boolean) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.products = products;
    this.status = status;
  }
}
