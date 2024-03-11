import {BaseDto} from "./base.dto";
import {ReceiptDetailsDto} from "./receipt-details.dto";

export class ReceiptDto extends BaseDto {
  id: number;
  status: boolean;
  staffFullname: string;
  supplierName: string;
  totalMoney: number;
  receiptDetails: ReceiptDetailsDto[];

  constructor(createdDate: Date, updatedDate: Date, id: number, status: boolean, staffFullname: string, supplierName: string, totalMoney: number, receiptDetails: ReceiptDetailsDto[]) {
    super(createdDate, updatedDate);
    this.id = id;
    this.status = status;
    this.staffFullname = staffFullname;
    this.supplierName = supplierName;
    this.totalMoney = totalMoney;
    this.receiptDetails = receiptDetails;
  }
}
