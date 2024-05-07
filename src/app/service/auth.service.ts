import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LoginDto} from "../dto/login.dto";
import {TokenService} from "./token.service";
import {ForgotPasswordDto} from "../dto/forgot-password.dto";
import {ChangePasswordDto} from "../dto/change-password.dto";
import {ToastrService} from "ngx-toastr";
import {CustomerDto} from "../dto/customer.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiCategoryUrl = `${Environment.apiBaseUrl}`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient, private tokenService: TokenService, private toastr: ToastrService) {
  }

  login(loginDto: LoginDto) {
    return this.http.post(`${this.apiCategoryUrl}/login`, loginDto, this.apiConfigUrl);
  }

  logout() {
    this.tokenService.removeToken();
    this.toastr.success('Đăng xuất thành công', 'Thông báo');
    window.location.href = '/login';
  }

  verifyEmail(email: string, verificationCode: string) {
    let verifyEmailRequest = {
      email: email,
      verificationCode: verificationCode
    }
    return this.http.post(`${this.apiCategoryUrl}/verify-email`, verifyEmailRequest, this.apiConfigUrl);
  }

  resendVerificationCode(email: string) {
    let queryParams = new HttpParams().append("email", email);
    return this.http.post(`${this.apiCategoryUrl}/resend-verification-code`, null, {params: queryParams});
  }

  // register(register: RegisterDto) {
  //   return this.http.post(`${Environment.apiBaseUrl}/register`, register, this.apiConfigUrl);
  // }

  register(customer: CustomerDto) {
    const formData = new FormData();
    formData.append('fullname', customer.fullname);
    formData.append('phone', customer.phone);
    formData.append('gender', customer.gender);
    if (customer.birthday != null) {
      formData.append('birthday', customer.birthday);
    }
    formData.append('address', customer.address);
    formData.append('account.email', customer.account.email);
    formData.append('account.password', customer.account.password);
    formData.append('account.status', 'true');
    return this.http.post(`${Environment.apiBaseUrl}/register`, formData);
  }

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.http.put(`${Environment.apiBaseUrl}/forgot-password`, forgotPasswordDto, this.apiConfigUrl);
  }

  changePassword(changePasswordDto: ChangePasswordDto) {
    changePasswordDto.email = this.tokenService.getUserEmail();
    return this.http.put(`${Environment.apiBaseUrl}/change-password`, changePasswordDto, this.apiConfigUrl);
  }

  // getProfile(email: string) {
  //   return this.http.get(`${Environment.apiBaseUrl}/profile/${email}`, this.apiConfigUrl);
  // }

  getProfile() {
    return this.http.get(`${Environment.apiBaseUrl}/profile`, this.apiConfigUrl);
  }
}
