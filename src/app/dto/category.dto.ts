import {BaseDto} from "./base.dto";

export class CategoryDto extends BaseDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: boolean;

  constructor(id: number, name: string, slug: string, description: string, status: boolean, createdDate: Date, updatedDate: Date) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.status = status;
  }
}
