import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {TokenService} from "../../../service/token.service";
import {CartService} from "../../../service/cart.service";

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css']
})
export class ClientHeaderComponent implements OnInit {
  protected readonly window = window;
  fullName: string = '';
  cartNumber: number = 0;

  constructor(private authService: AuthService, private tokenService: TokenService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.getProfile();
    this.cartService.itemCount$.subscribe({
      next: (value: any) => {
        this.cartNumber = value.length;
      }
    });
  }


  logout() {
    this.authService.logout();
  }

  isLogin(): boolean {
    return this.tokenService.isLogin();
  }

  getProfile() {
    this.authService.getProfile(this.tokenService.getUserEmail()).subscribe({
      next: (response: any) => {
        this.fullName = response.fullname;
      }
    });
  }
}
