import {BaseDto} from "./base.dto";

export class ChangePasswordDto extends BaseDto {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;


  constructor(createdDate: Date, updatedDate: Date, email: string, oldPassword: string, newPassword: string, confirmPassword: string) {
    super(createdDate, updatedDate);
    this.email = email;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}
