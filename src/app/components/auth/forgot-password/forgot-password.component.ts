import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ForgotPasswordDto} from "../../../dto/forgot-password.dto";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  isLoaderDisplayNone: boolean = false;
  isLoaderVerifyCodeDisplayNone: boolean = false;
  forgotPasswordForm: FormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      verificationCode: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {validators: this.matchPassword}
  );

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : {mismatch: true};
  }

  constructor(private title: Title,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Quên mật khẩu');
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.forgotPassword(this.forgotPasswordForm.value);
  }

  sendVerificationCode() {
    this.isLoaderVerifyCodeDisplayNone = true;
    return this.authService.resendVerificationCode(this.forgotPasswordForm.get('email')?.value).subscribe({
      next: () => {
        this.toastr.success("Đã gửi mã xác minh");
        this.isLoaderVerifyCodeDisplayNone = false;
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        this.isLoaderVerifyCodeDisplayNone = false;
      }
    });
  }

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    this.isLoaderDisplayNone = true;
    return this.authService.forgotPassword(forgotPasswordDto).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message);
        this.isLoaderDisplayNone = false;
        this.router.navigateByUrl("/login");
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        this.isLoaderDisplayNone = false;
      }
    });
  }
}
