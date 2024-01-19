import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {NgOptimizedImage} from "@angular/common";
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import {ClientMenuComponent} from './components/client/client-menu/client-menu.component';

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
      //preventDuplicates: true,  // Ngăn chặn hiển thị các thông báo trùng lặp
      tapToDismiss: true,  // Cho phép bấm vào thông báo để đóng nó
      // closeButton: true,  // Hiển thị nút đóng
      extendedTimeOut: 1000,  // Thời gian mở rộng cho thông báo khi di chuyển chuột qua (đơn vị là miligiây)
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
