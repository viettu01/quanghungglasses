import { AccountDto } from "./account.dto";
import {BaseDto} from "./base.dto";

export class CustomerDto extends BaseDto {
  id: number;
  fullname: string;
  phone: string
  gender: string;
  birthday: Date;
  AccountDto: AccountDto;

  constructor(createdDate: Date, updatedDate: Date, id: number, fullname: string, phone: string, gender: string, birthday: Date, AccountDto: AccountDto) {
    super(createdDate, updatedDate);
    this.id = id;
    this.fullname = fullname;
    this.phone = phone;
    this.gender = gender;
    this.birthday = birthday;
    this.AccountDto = AccountDto;
  }
}
