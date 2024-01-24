import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  constructor(private router: Router, private title: Title, private toastr: ToastrService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.title.setTitle("Xác thực email");
  }

  onCodeChanged(code: string) {

  }

// this called only if user entered full code
  onCodeCompleted(code: string) {
    this.authService.verifyEmail(localStorage.getItem("email") || "", code).subscribe({
      next: (response: any) => {
        localStorage.removeItem("email");
        this.toastr.success("Xác thực email thành công", "Thông báo");
        this.router.navigateByUrl("/login");
      },
      error: (error: any) => {
        this.toastr.error(error.error, "Thông báo");
      }
    });
  }

  resendVerificationCode() {
    this.authService.resendVerificationCode(localStorage.getItem("email") || "").subscribe({
      next: (response: any) => {
        this.toastr.success(response.message, "Thông báo");
      },
      error: (error: any) => {
        this.toastr.error("Gửi lại mã xác thực thất bại", "Thông báo");
      }
    });
  }
}
