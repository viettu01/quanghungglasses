import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private title: Title, private toastr: ToastrService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.title.setTitle("Đăng nhập");
  }

}
