export class ForgotPasswordDto {
  email: string;
  verificationCode: string;
  newPassword: string;

  constructor(email: string, verificationCode: string, newPassword: string) {
    this.email = email;
    this.verificationCode = verificationCode;
    this.newPassword = newPassword;
  }
}
