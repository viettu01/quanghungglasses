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

  onCodeCompleted(code: string) {
    this.authService.verifyEmail(localStorage.getItem("email") || "", code).subscribe({
      next: () => {
        localStorage.removeItem("email");
        this.toastr.success("Xác thực email thành công");
        this.router.navigateByUrl("/login");
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }

  resendVerificationCode() {
    this.authService.resendVerificationCode(localStorage.getItem("email") || "").subscribe({
      next: (response: any) => {
        this.toastr.success(response.message);
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error("Gửi lại mã xác thực thất bại");
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }
}
