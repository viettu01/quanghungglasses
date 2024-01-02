import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  constructor(private router: Router) {
  }

  isExactRouteStartWith(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  isExactRoute(route: string): boolean {
    return this.router.url == route;
  }
}
