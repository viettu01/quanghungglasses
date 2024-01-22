import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {RegisterDto} from "../../../dto/register.dto";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoaderDisplayNone: boolean = false;
  registerForm: FormGroup = new FormGroup(
    {
      fullname: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.email]),
      password: new FormControl('', [
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
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : {mismatch: true};
  }

  constructor(private authService: AuthService, private router: Router, private title: Title, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle("Đăng ký tài khoản");
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.register();
  }

  register() {
    //chuển hương trang web su dung window.location.href
    // window.location.href = "/verify-email";
    this.isLoaderDisplayNone = true;
    return this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.toastr.success("Đăng ký tài khoản thành công", "Thông báo");
          this.isLoaderDisplayNone = false;
          this.router.navigateByUrl("/verify-email");
        },
        error: (err) => {
          this.toastr.error("Đăng ký tài khoản thất bại", "Thông báo");
          console.log(err);
        }
      }
    );
  }
}
