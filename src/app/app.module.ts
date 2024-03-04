import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CodeInputModule} from "angular-code-input";
import {JwtModule} from "@auth0/angular-jwt";
import {Environment} from "./environment/environment";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import {EditorModule, TINYMCE_SCRIPT_SRC} from "@tinymce/tinymce-angular";
import {NgSelectModule} from "@ng-select/ng-select";
import {ForgotPasswordComponent} from './components/auth/forgot-password/forgot-password.component';
import {NgxDropzoneModule} from "ngx-dropzone";

import {AppComponent} from './app.component';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {AccessDeniedComponent} from './components/errors/access-denied/access-denied.component';
import {PageNotFoundComponent} from './components/errors/page-not-found/page-not-found.component';
import {InternalServerErrorComponent} from './components/errors/internal-server-error/internal-server-error.component';
import {AdminLayoutComponent} from './components/admin/admin-layout/admin-layout.component';
import {AdminHeaderComponent} from './components/admin/admin-header/admin-header.component';
import {AdminFooterComponent} from './components/admin/admin-footer/admin-footer.component';
import {AdminSidebarComponent} from './components/admin/admin-sidebar/admin-sidebar.component';
import {CategoryComponent} from './components/admin/category/category.component';
import {DashboardComponent} from './components/admin/dashboard/dashboard.component';
import {ClientLayoutComponent} from './components/client/client-layout/client-layout.component';
import {HomeComponent} from './components/client/home/home.component';
import {ClientHeaderComponent} from './components/client/client-header/client-header.component';
import {ClientFooterComponent} from './components/client/client-footer/client-footer.component';
import {
  AdminProductListComponent
} from './components/admin/admin-product/admin-product-list/admin-product-list.component';
import {
  AdminProductDetailsComponent
} from './components/admin/admin-product/admin-product-details/admin-product-details.component';
import {
  AdminProductSaveComponent
} from './components/admin/admin-product/admin-product-save/admin-product-save.component';
import {MaterialComponent} from './components/admin/material/material.component';
import {OriginComponent} from './components/admin/origin/origin.component';
import {ShapeComponent} from './components/admin/shape/shape.component';
import {BrandComponent} from './components/admin/brand/brand.component';
import {SupplierComponent} from './components/admin/supplier/supplier.component';
import {BannerComponent} from './components/admin/banner/banner.component';
import {AdminOrderListComponent} from './components/admin/admin-order/admin-order-list/admin-order-list.component';
import {AdminOrderSaveComponent} from './components/admin/admin-order/admin-order-save/admin-order-save.component';
import {
  AdminOrderDetailsComponent
} from './components/admin/admin-order/admin-order-details/admin-order-details.component';
import {CustomerListComponent} from './components/admin/customer/customer-list/customer-list.component';
import {CustomerSaveComponent} from './components/admin/customer/customer-save/customer-save.component';
import {CustomerDetailsComponent} from './components/admin/customer/customer-details/customer-details.component';
import {ReceiptListComponent} from './components/admin/receipt/receipt-list/receipt-list.component';
import {ReceiptSaveComponent} from './components/admin/receipt/receipt-save/receipt-save.component';
import {ReceiptDetailsComponent} from './components/admin/receipt/receipt-details/receipt-details.component';
import {StaffListComponent} from './components/admin/staff/staff-list/staff-list.component';
import {StaffSaveComponent} from './components/admin/staff/staff-save/staff-save.component';
import {StaffDetailsComponent} from './components/admin/staff/staff-details/staff-details.component';
import {ClientMenuComponent} from './components/client/client-menu/client-menu.component';
import {VerifyEmailComponent} from './components/auth/verify-email/verify-email.component';
import {ChangePasswordComponent} from './components/auth/change-password/change-password.component';
import {
  AdminWarrantyListComponent
} from './components/admin/admin-warranty/admin-warranty-list/admin-warranty-list.component';
import {
  AdminWarrantyDetailsComponent
} from './components/admin/admin-warranty/admin-warranty-details/admin-warranty-details.component';
import {
  AdminWarrantySaveComponent
} from './components/admin/admin-warranty/admin-warranty-save/admin-warranty-save.component';
import {ClientBannerComponent} from './components/client/client-banner/client-banner.component';
import {NoLeadingSpaceDirective} from './utils/no-leading-space.directive';
import {OnlyNumberDirective} from './utils/only-number.directive';
import {OnlyNumberFloatDirective} from "./utils/only-number-float.directive";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AccessDeniedComponent,
    PageNotFoundComponent,
    InternalServerErrorComponent,
    AdminLayoutComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    CategoryComponent,
    DashboardComponent,
    ClientLayoutComponent,
    HomeComponent,
    ClientHeaderComponent,
    ClientFooterComponent,
    AdminProductListComponent,
    AdminProductDetailsComponent,
    AdminProductSaveComponent,
    MaterialComponent,
    OriginComponent,
    ShapeComponent,
    BrandComponent,
    SupplierComponent,
    BannerComponent,
    ClientMenuComponent,
    VerifyEmailComponent,
    AdminOrderListComponent,
    AdminOrderSaveComponent,
    AdminOrderDetailsComponent,
    CustomerListComponent,
    CustomerSaveComponent,
    CustomerDetailsComponent,
    ReceiptListComponent,
    ReceiptSaveComponent,
    ReceiptDetailsComponent,
    StaffListComponent,
    StaffSaveComponent,
    StaffDetailsComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    AdminWarrantyListComponent,
    AdminWarrantyDetailsComponent,
    AdminWarrantySaveComponent,
    ClientBannerComponent,
    NoLeadingSpaceDirective,
    OnlyNumberDirective,
    OnlyNumberFloatDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    NgOptimizedImage,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,  // Thời gian hiển thị của thông báo (đơn vị là miligiây)
      positionClass: 'toast-top-right',  // Vị trí của thông báo trên màn hình
      preventDuplicates: true,  // Ngăn chặn hiển thị các thông báo trùng lặp
      tapToDismiss: true,  // Cho phép bấm vào thông báo để đóng nó
      // closeButton: true,  // Hiển thị nút đóng
      extendedTimeOut: 1000,  // Thời gian mở rộng cho thông báo khi di chuyển chuột qua (đơn vị là miligiây)
    }),
    BrowserAnimationsModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: false
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        allowedDomains: [`${Environment.domain}`], // Các đường dẫn sử dụng token
        disallowedRoutes: [`${Environment.domain}/login`] // Các đường dẫn không sử dụng token
      }
    }),
    EditorModule,
    NgSelectModule,
    NgxDropzoneModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: TINYMCE_SCRIPT_SRC,
      useValue: 'tinymce/tinymce.min.js'
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
