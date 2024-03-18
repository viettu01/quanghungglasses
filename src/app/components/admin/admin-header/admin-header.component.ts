import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {TokenService} from "../../../service/token.service";

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  fullName: string = '';

  constructor(private authService: AuthService, private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.getProfile();
  }

  logout() {
    this.authService.logout();
  }

  getProfile() {
    this.authService.getProfile(this.tokenService.getUserEmail()).subscribe({
      next: (response: any) => {
        this.fullName = response.fullname;
      }
    });
  }
}
