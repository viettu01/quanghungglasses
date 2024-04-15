import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {TokenService} from "../../../service/token.service";

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  roles: string[] = this.tokenService.getUserRoles();

  constructor(private router: Router, private tokenService: TokenService) {
    console.log(this.roles);
  }

  isExactRouteStartWith(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  isExactRoute(route: string): boolean {
    return this.router.url == route;
  }
}
