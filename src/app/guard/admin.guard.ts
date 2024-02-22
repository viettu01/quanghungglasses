import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from "@angular/core";
import {TokenService} from "../service/token.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private tokenService: TokenService, private router: Router) {
  }

  canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
    // debugger
    const requiredRole = ['ROLE_ADMIN', 'ROLE_STAFF']; // Quyền truy cập yêu cầu
    const roles = this.tokenService.getUserRoles(); // Lấy danh sách các quyền từ AuthService
    // console.log("role:" + roles);
    // debugger
    if (roles == null || roles.length == 0 || this.tokenService.isTokenExpired()) {
      // nếu token hết hạn, chuyển hướng đến trang đăng nhập
      return this.router.createUrlTree(['/login']);
    } else if (roles.some((role: string) => requiredRole.includes(role))) {
      // Nếu người dùng có ít nhất một quyền nằm trong danh sách quyền yêu cầu
      return true; // Người dùng có quyền truy cập
    } else {
      // Người dùng không có quyền truy cập, chuyển hướng đến trang access-denied
      return this.router.createUrlTree(['/access-denied']);
    }
  };
}
