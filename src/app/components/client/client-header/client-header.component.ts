import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {TokenService} from "../../../service/token.service";
import {CartService} from "../../../service/cart.service";
import {CartDto} from "../../../dto/cart.dto";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css']
})
export class ClientHeaderComponent implements OnInit {
  roles: string[] = this.tokenService.getUserRoles();
  protected readonly window = window;
  fullName: string = '';
  cartNumber: number = 0;
  name: string = '';

  constructor(private authService: AuthService, private tokenService: TokenService, private title: Title,
              private cartService: CartService, private router: Router, private toastr: ToastrService) {
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
    this.authService.getProfile().subscribe({
      next: (response: any) => {
        this.fullName = response.fullname;
      }
    });
  }

  goToCart() {
    if (this.tokenService.isLogin()) {
      this.router.navigateByUrl('/gio-hang').then();
    } else {
      this.toastr.error('Vui lòng đăng nhập để xem giỏ hàng');
      this.router.navigateByUrl('/login').then();
    }
  }

  search() {
    this.router.navigateByUrl('/tim-kiem?ten-san-pham=' + this.name).then();
  }
}
