import {BaseDto} from "./base.dto";

export class AccountDto extends BaseDto {
  id: number;
  email: string;
  avatarFile: string;
  password: string;
  status: boolean;
  roleIds: number[];

  constructor(createdDate: Date, updatedDate: Date, id: number, email: string, avatarFile: string, password: string, status: boolean, roleIds: number[]) {
    super(createdDate, updatedDate);
    this.id = id;
    this.email = email;
    this.avatarFile = avatarFile;
    this.password = password;
    this.status = status;
    this.roleIds = roleIds;
  }
}
