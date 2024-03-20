import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {TokenService} from "../../../service/token.service";
import {CartService} from "../../../service/cart.service";
import {CartDto} from "../../../dto/cart.dto";

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
    if (this.tokenService.isLogin()) {
      this.getProfile();
      this.cartService.getCartItemsServer();
    }

    this.cartService.cartItems$.subscribe({
      next: (items: CartDto[]) => {
        this.cartNumber = items.length;
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
