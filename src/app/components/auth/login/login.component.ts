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
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        localStorage.removeItem('carts');
        this.tokenService.setToken(response.token);
        const roles = this.tokenService.getUserRoles();
        const requiredRole = ['ROLE_ADMIN', 'ROLE_STAFF'];
        this.toastr.success('Đăng nhập thành công');
        if (roles.some((role: string) => requiredRole.includes(role))) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      },
      error: (error: any) => {
        if (error.status === 403 || error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }
}
