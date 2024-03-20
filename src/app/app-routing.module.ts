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
import {CustomerDetailsComponent} from "./components/admin/customer/customer-details/customer-details.component";
import {StaffDetailsComponent} from "./components/admin/staff/staff-details/staff-details.component";
import {ChangePasswordComponent} from "./components/auth/change-password/change-password.component";
import {UserGuard} from "./guard/user.guard";
import {AdminOrderSaveComponent} from "./components/admin/admin-order/admin-order-save/admin-order-save.component";
import {
  AdminOrderDetailsComponent
} from "./components/admin/admin-order/admin-order-details/admin-order-details.component";
import {
  AdminWarrantyListComponent
} from "./components/admin/admin-warranty/admin-warranty-list/admin-warranty-list.component";
import {
  AdminWarrantyDetailsComponent
} from "./components/admin/admin-warranty/admin-warranty-details/admin-warranty-details.component";
import {
  AdminWarrantySaveComponent
} from "./components/admin/admin-warranty/admin-warranty-save/admin-warranty-save.component";
import {ReceiptSaveComponent} from "./components/admin/receipt/receipt-save/receipt-save.component";
import {ReceiptDetailsComponent} from "./components/admin/receipt/receipt-details/receipt-details.component";
import {AdminSaleListComponent} from "./components/admin/admin-sale/admin-sale-list/admin-sale-list.component";
import {AdminSaleSaveComponent} from "./components/admin/admin-sale/admin-sale-save/admin-sale-save.component";
import {
  ClientProductDetailsComponent
} from "./components/client/client-product/client-product-details/client-product-details.component";
import {
  ClientProductByCategoryComponent
} from "./components/client/client-product/client-product-by-category/client-product-by-category.component";
import {CartComponent} from "./components/client/cart/cart.component";

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: '', component: DashboardComponent},

      {path: 'staff', component: StaffListComponent},
      {path: 'staff/save', component: StaffSaveComponent},
      {path: 'staff/save/:id', component: StaffSaveComponent},
      {path: 'staff/:id', component: StaffDetailsComponent},

      {path: 'customer', component: CustomerListComponent},
      {path: 'customer/save', component: CustomerSaveComponent},
      {path: 'customer/save/:id', component: CustomerSaveComponent},
      {path: 'customer/:id', component: CustomerDetailsComponent},

      {path: 'banner', component: BannerComponent},
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

      {path: 'receipt', component: ReceiptListComponent},
      {path: 'receipt/save', component: ReceiptSaveComponent},
      {path: 'receipt/save/:id', component: ReceiptSaveComponent},
      {path: 'receipt/:id', component: ReceiptDetailsComponent},

      {path: 'order', component: AdminOrderListComponent},
      {path: 'order/save', component: AdminOrderSaveComponent},
      {path: 'order/save/:id', component: AdminOrderSaveComponent},
      {path: 'order/:id', component: AdminOrderDetailsComponent},

      {path: 'warranty', component: AdminWarrantyListComponent},
      {path: 'warranty/save', component: AdminWarrantySaveComponent},
      {path: 'warranty/save/:id', component: AdminWarrantySaveComponent},
      {path: 'warranty/:id', component: AdminWarrantyDetailsComponent},

      {path: 'sale', component: AdminSaleListComponent},
      {path: 'sale/save', component: AdminSaleSaveComponent},
      {path: 'sale/save/:id', component: AdminSaleSaveComponent},
    ],
    canActivate: [AdminGuard], // Thêm guard vào đây
  },
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'gio-hang', component: CartComponent},
      {path: 'danh-muc/:slug', component: ClientProductByCategoryComponent},
      {path: 'san-pham/:slug', component: ClientProductDetailsComponent},
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [UserGuard]},
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
