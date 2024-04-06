import {WarrantyDetailsDto} from "./warranty-details.dto";

export class WarrantyDto {
  id: number;
  customerName: string;
  customerPhone: string;
  staffName: string;
  status: boolean;
  createdDate: Date;
  updatedDate: Date;
  warrantyDetails: WarrantyDetailsDto[];

  constructor(id: number, customerName: string, customerPhone: string, staffName: string, status: boolean, createdDate: Date, updatedDate: Date, warrantyDetails: WarrantyDetailsDto[]) {
    this.id = id;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.staffName = staffName;
    this.status = status;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.warrantyDetails = warrantyDetails;
  }

  static createEmpty(): WarrantyDto {
    return new WarrantyDto(0, "", "", "", false, new Date(), new Date(), []);
  }
}
