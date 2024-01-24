import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {CustomerService} from "../../../service/customer.service";

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

  constructor(private customerService: CustomerService, private router: Router, private title: Title, private toastr: ToastrService) {
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
    this.isLoaderDisplayNone = true;
    return this.customerService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message, "Thông báo");
          localStorage.setItem("email", this.registerForm.value.email);
          this.isLoaderDisplayNone = false;

          this.router.navigateByUrl("/verify-email");
        },
        error: (error: any) => {
          this.toastr.error(error.error, "Thông báo");
          this.isLoaderDisplayNone = false;
        }
      }
    );
  }
}
