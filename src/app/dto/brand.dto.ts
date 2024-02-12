import {BaseDto} from "./base.dto";

export class BrandDto extends BaseDto {
  id: number;
  name: string;

  constructor(createdDate: Date, updatedDate: Date, id: number, name: string) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
  }
}
