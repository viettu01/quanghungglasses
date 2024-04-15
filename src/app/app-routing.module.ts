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
import {AdminAndStaffGuard} from "./guard/admin-and-staff.guard";
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
import {CheckoutComponent} from "./components/client/client-order/checkout/checkout.component";
import {
  ClientProductSearchComponent
} from "./components/client/client-product/client-product-search/client-product-search.component";
import {
  ClientOrderDetailsComponent
} from "./components/client/client-order/client-order-details/client-order-details.component";
import {ClientOrderListComponent} from "./components/client/client-order/client-order-list/client-order-list.component";
import {PaymentSuccessComponent} from "./components/client/payment-success/payment-success.component";
import {AdminGuard} from "./guard/admin.guard";

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: '', component: DashboardComponent},

      {path: 'staff', component: StaffListComponent, canActivate: [AdminGuard]},
      {path: 'staff/save', component: StaffSaveComponent, canActivate: [AdminGuard]},
      {path: 'staff/save/:id', component: StaffSaveComponent, canActivate: [AdminGuard]},
      {path: 'staff/:id', component: StaffDetailsComponent, canActivate: [AdminGuard]},

      {path: 'customer', component: CustomerListComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'customer/save', component: CustomerSaveComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'customer/save/:id', component: CustomerSaveComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'customer/:id', component: CustomerDetailsComponent, canActivate: [AdminAndStaffGuard]},

      {path: 'banner', component: BannerComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'report', component: ReportComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'supplier', component: SupplierComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'material', component: MaterialComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'shape', component: ShapeComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'brand', component: BrandComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'origin', component: OriginComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'category', component: CategoryComponent, canActivate: [AdminAndStaffGuard]},

      {path: 'product', component: AdminProductListComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'product/save', component: AdminProductSaveComponent, canActivate: [AdminGuard]},
      {path: 'product/save/:id', component: AdminProductSaveComponent, canActivate: [AdminGuard]},
      {path: 'product/:id', component: AdminProductDetailsComponent, canActivate: [AdminAndStaffGuard]},

      {path: 'receipt', component: ReceiptListComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'receipt/save', component: ReceiptSaveComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'receipt/save/:id', component: ReceiptSaveComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'receipt/:id', component: ReceiptDetailsComponent, canActivate: [AdminAndStaffGuard]},

      {path: 'order', component: AdminOrderListComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'order/save', component: AdminOrderSaveComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'order/save/:id', component: AdminOrderSaveComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'order/:id', component: AdminOrderDetailsComponent, canActivate: [AdminAndStaffGuard]},

      {path: 'warranty', component: AdminWarrantyListComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'warranty/save', component: AdminWarrantySaveComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'warranty/save/:id', component: AdminWarrantySaveComponent, canActivate: [AdminAndStaffGuard]},

      {path: 'sale', component: AdminSaleListComponent, canActivate: [AdminAndStaffGuard]},
      {path: 'sale/save', component: AdminSaleSaveComponent, canActivate: [AdminGuard]},
      {path: 'sale/save/:id', component: AdminSaleSaveComponent, canActivate: [AdminGuard]},
    ],
    // canActivate: [AdminAndStaffGuard], // Thêm guard vào đây
  },
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'gio-hang', component: CartComponent, canActivate: [UserGuard]},
      {path: 'danh-muc/:slug', component: ClientProductByCategoryComponent},
      {path: 'san-pham/:slug', component: ClientProductDetailsComponent},
      {path: 'tim-kiem', component: ClientProductSearchComponent},
      {path: 'thanh-toan', component: CheckoutComponent, canActivate: [UserGuard]},
      {path: 'don-hang', component: ClientOrderListComponent, canActivate: [UserGuard]},
      {path: 'don-hang/:id', component: ClientOrderDetailsComponent, canActivate: [UserGuard]},
      {path: 'thanh-toan-thanh-cong/:orderId', component: PaymentSuccessComponent, canActivate: [UserGuard]},
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
