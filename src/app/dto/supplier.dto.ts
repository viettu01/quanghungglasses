import {BaseDto} from "./base.dto";

export class SupplierDto extends BaseDto {
  id: number;
  name: string;
  phone: string;
  address: string;

  constructor(createdDate: Date, updatedDate: Date, id: number, name: string, phone: string, address: string) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
  }
}
