import {BaseDto} from "./base.dto";

export class AccountDto extends BaseDto {
  id: number;
  email: string;
  avatar: string;
  password: string;
  status: boolean;
  roles: string[];

  constructor(createdDate: Date, updatedDate: Date, id: number, email: string, avatar: string, password: string, status: boolean, roles: string[]) {
    super(createdDate, updatedDate);
    this.id = id;
    this.email = email;
    this.avatar = avatar;
    this.password = password;
    this.status = status;
    this.roles = roles;
  }
}
