import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {Utils} from "../../../utils/utils";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  protected readonly Utils = Utils;
  isLoaderDisplayNone: boolean = false;
  registerForm: FormGroup = new FormGroup(
    {
      fullname: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern("^0[0-9]{9}$")
      ]),
      birthday: new FormControl(new Date()),
      gender: new FormControl('Nam'),
      address: new FormControl('', [Validators.maxLength(200)]),
      account: new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
          Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
        ]),
        confirmPassword: new FormControl('', [Validators.required])
      }),
    },
    {validators: this.matchPassword}
  );

  matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('account')?.get('password')?.value;
    const confirmPassword = control.get('account')?.get('confirmPassword')?.value;

    return password === confirmPassword ? null : {mismatch: true};
  }

  constructor(private authService: AuthService, private router: Router, private title: Title, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle("Đăng ký tài khoản");
  }

  onSubmit() {
    if (this.registerForm.invalid)
      return;

    this.register();
  }

  register() {
    this.isLoaderDisplayNone = true;
    return this.authService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message);
          localStorage.setItem("email", this.registerForm.get("account")?.get("email")?.value);
          this.isLoaderDisplayNone = false;
          this.router.navigateByUrl("/verify-email");
          // this.router.navigateByUrl("/login");
        },
        error: (error: any) => {
          if (error.status === 400)
            this.toastr.error(error.error);
          else
            this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');

          this.isLoaderDisplayNone = false;
        }
      }
    );
  }
}
