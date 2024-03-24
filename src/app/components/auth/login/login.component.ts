import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TokenService} from 'src/app/service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoaderDisplayNone: boolean = false;
  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    }
  );

  constructor(private router: Router, private title: Title, private toastr: ToastrService,
              private authService: AuthService, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.title.setTitle("Đăng nhập");
  }

  login() {
    this.isLoaderDisplayNone = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.isLoaderDisplayNone = false;
        localStorage.removeItem('carts');
        localStorage.removeItem('email');
        this.tokenService.setToken(response.token);
        const roles = this.tokenService.getUserRoles();
        const requiredRole = ['ROLE_ADMIN', 'ROLE_STAFF'];
        this.toastr.success('Đăng nhập thành công');
        if (roles.some((role: string) => requiredRole.includes(role))) {
          this.router.navigateByUrl('/admin').then(r => window.location.reload());
        } else {
          this.router.navigateByUrl("/").then(r => window.location.reload());
        }
      },
      error: (error: any) => {
        this.isLoaderDisplayNone = false;
        if (error.status === 403 || error.status === 400) {
          this.toastr.error(error.error);
          if (error.error === 'Email chưa được xác minh') {
            localStorage.setItem('email', this.loginForm.get('email')?.value);
            this.router.navigateByUrl('/verify-email');
          }
        } else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }
}
