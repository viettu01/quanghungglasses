import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ChangePasswordDto} from "../../../dto/change-password.dto";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  isLoaderDisplayNone: boolean = false;
  changePasswordForm: FormGroup = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{9,}$/)
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
    this.title.setTitle('Đổi mật khẩu');
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.changePassword(this.changePasswordForm.value);
  }

  changePassword(changePasswordDto: ChangePasswordDto) {
    this.isLoaderDisplayNone = true;
    return this.authService.changePassword(changePasswordDto).subscribe({
      next: () => {
        this.toastr.success("Đổi mật khẩu thành công", "Thông báo");
        this.router.navigate(['/login']);
        this.authService.logout();
      },
      error: (error: any) => {
        this.isLoaderDisplayNone = false;
        if (error.status === 0)
          this.toastr.error("Đổi mật khẩu thất bại", "Thông báo");
        else
          this.toastr.error(error.error, "Thất bại");
      }
    });
  }
}
