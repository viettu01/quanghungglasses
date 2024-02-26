import {AccountDto} from "./account.dto";
import {BaseDto} from "./base.dto";

export class StaffDto extends BaseDto {
  id: number;
  fullname: string;
  phone: string
  gender: string;
  birthday: Date;
  status: boolean;
  totalOrder: number; // Tổng số đơn hàng đã xử lý
  totalMoney: number; // Tổng số tiền đã bán
  account: AccountDto;

  constructor(createdDate: Date, updatedDate: Date, id: number, fullname: string, phone: string, gender: string, birthday: Date, status: boolean, totalOrder: number, totalMoney: number, account: AccountDto) {
    super(createdDate, updatedDate);
    this.id = id;
    this.fullname = fullname;
    this.phone = phone;
    this.gender = gender;
    this.birthday = birthday;
    this.status = status;
    this.totalOrder = totalOrder;
    this.totalMoney = totalMoney;
    this.account = account;
  }
}
