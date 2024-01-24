import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiCategoryUrl = `${Environment.apiBaseUrl}`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    let loginRequest = {
      email: email,
      password: password
    }
    return this.http.post(`${this.apiCategoryUrl}/login`, loginRequest, this.apiConfigUrl);
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
}
