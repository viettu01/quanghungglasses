import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";

import {CategoryComponent} from "./components/admin/category/category.component";
import {AdminLayoutComponent} from "./components/admin/admin-layout/admin-layout.component";
import {DashboardComponent} from "./components/admin/dashboard/dashboard.component";
import {
  AdminProductListComponent
} from "./components/admin/admin-product/admin-product-list/admin-product-list.component";
import {
  AdminProductDetailsComponent
} from "./components/admin/admin-product/admin-product-details/admin-product-details.component";
import {
  AdminProductSaveComponent
} from "./components/admin/admin-product/admin-product-save/admin-product-save.component";
import {SupplierComponent} from "./components/admin/supplier/supplier.component";
import {MaterialComponent} from "./components/admin/material/material.component";
import {ShapeComponent} from "./components/admin/shape/shape.component";
import {BrandComponent} from "./components/admin/brand/brand.component";
import {OriginComponent} from "./components/admin/origin/origin.component";
import {BannerComponent} from "./components/admin/banner/banner.component";
import {SaleComponent} from "./components/admin/sale/sale.component";
import {AdminOrderListComponent} from "./components/admin/admin-order/admin-order-list/admin-order-list.component";
import {CustomerListComponent} from "./components/admin/customer/customer-list/customer-list.component";
import {CustomerSaveComponent} from "./components/admin/customer/customer-save/customer-save.component";
import {ReceiptListComponent} from "./components/admin/receipt/receipt-list/receipt-list.component";
import {ReportComponent} from "./components/admin/report/report.component";
import {StaffListComponent} from "./components/admin/staff/staff-list/staff-list.component";
import {StaffSaveComponent} from "./components/admin/staff/staff-save/staff-save.component";

import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {PageNotFoundComponent} from "./components/errors/page-not-found/page-not-found.component";
import {InternalServerErrorComponent} from "./components/errors/internal-server-error/internal-server-error.component";
import {AccessDeniedComponent} from "./components/errors/access-denied/access-denied.component";

import {ClientLayoutComponent} from "./components/client/client-layout/client-layout.component";
import {HomeComponent} from "./components/client/home/home.component";
import {VerifyEmailComponent} from "./components/auth/verify-email/verify-email.component";
import {AdminGuard} from "./guard/admin.guard";
import {ForgotPasswordComponent} from "./components/auth/forgot-password/forgot-password.component";

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: '', component: DashboardComponent},
      {path: 'staff', component: StaffListComponent},
      {path: 'staff/save', component: StaffSaveComponent},
      {path: 'customer', component: CustomerListComponent},
      {path: 'customer/save', component: CustomerSaveComponent},
      {path: 'banner', component: BannerComponent},
      {path: 'sale', component: SaleComponent},
      {path: 'order', component: AdminOrderListComponent},
      {path: 'receipt', component: ReceiptListComponent},
      {path: 'report', component: ReportComponent},
      {path: 'supplier', component: SupplierComponent},
      {path: 'material', component: MaterialComponent},
      {path: 'shape', component: ShapeComponent},
      {path: 'brand', component: BrandComponent},
      {path: 'origin', component: OriginComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'product', component: AdminProductListComponent},
      {path: 'product/save', component: AdminProductSaveComponent},
      {path: 'product/save/:id', component: AdminProductSaveComponent},
      {path: 'product/:id', component: AdminProductDetailsComponent},
    ],
    canActivate: [AdminGuard], // Thêm guard vào đây
  },
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {path: '', component: HomeComponent}
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'verify-email', component: VerifyEmailComponent},
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: 'server-error', component: InternalServerErrorComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
