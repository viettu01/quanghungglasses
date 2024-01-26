import {Component} from '@angular/core';
import {AuthService} from "../../../service/auth.service";
import {TokenService} from "../../../service/token.service";

@Component({
  selector: 'app-client-header',
  templateUrl: './client-header.component.html',
  styleUrls: ['./client-header.component.css']
})
export class ClientHeaderComponent {
  constructor(private authService: AuthService, private tokenService: TokenService) {
  }

  logout() {
    this.authService.logout();
  }

  isLogin(): boolean {
    return this.tokenService.isLogin();
  }

  protected readonly window = window;
}
