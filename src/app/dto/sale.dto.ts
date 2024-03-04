import {BaseDto} from "./base.dto";
import {SaleDetailsDto} from "./sale-details.dto";

export class SaleDto extends BaseDto {
  id: number;
  name: string;
  totalProduct: number;
  startDate: Date;
  endDate: Date;
  saleDetails: SaleDetailsDto[];

  constructor(createdDate: Date, updatedDate: Date, id: number, name: string, totalProduct: number, startDate: Date, endDate: Date, saleDetails: SaleDetailsDto[]) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
    this.totalProduct = totalProduct;
    this.startDate = startDate;
    this.endDate = endDate;
    this.saleDetails = saleDetails;
  }
}
