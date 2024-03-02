import {AccountDto} from "./account.dto";
import {BaseDto} from "./base.dto";

export class CustomerDto extends BaseDto {
  id: number;
  fullname: string;
  phone: string
  gender: string;
  birthday: Date;
  address: string;
  totalOrder: number; // Tổng số đơn hàng đã mua
  totalMoney: number; // Tổng số tiền đã mua
  account: AccountDto;

  constructor(createdDate: Date, updatedDate: Date, id: number, fullname: string, phone: string, gender: string, birthday: Date, address: string, totalOrder: number, totalMoney: number, account: AccountDto) {
    super(createdDate, updatedDate);
    this.id = id;
    this.fullname = fullname;
    this.phone = phone;
    this.gender = gender;
    this.birthday = birthday;
    this.address = address;
    this.totalOrder = totalOrder;
    this.totalMoney = totalMoney;
    this.account = account;
  }
}
