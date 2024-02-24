import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {FormControl, FormGroup} from "@angular/forms";
import {TokenService} from 'src/app/service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl(''),
      password: new FormControl('')
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
        this.tokenService.setToken(response.token);
        const roles = this.tokenService.getUserRoles();
        const requiredRole = ['ROLE_ADMIN', 'ROLE_STAFF'];
        if (roles.some((role: string) => requiredRole.includes(role))) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
        // this.toastr.success('Đăng nhập thành công', 'Thông báo');
      },
      error: (error: any) => {
        if (error.status === 0)
          this.toastr.error("Đăng nhập thất bại", "Thông báo");
        else
          this.toastr.error(error.error, 'Thông báo');
      }
    });
  }
}
