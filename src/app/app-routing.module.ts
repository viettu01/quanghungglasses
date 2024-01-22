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

import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {PageNotFoundComponent} from "./components/errors/page-not-found/page-not-found.component";
import {InternalServerErrorComponent} from "./components/errors/internal-server-error/internal-server-error.component";
import {AccessDeniedComponent} from "./components/errors/access-denied/access-denied.component";

import {ClientLayoutComponent} from "./components/client/client-layout/client-layout.component";
import {HomeComponent} from "./components/client/home/home.component";
import {VerifyEmailComponent} from "./components/auth/verify-email/verify-email.component";

const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: '', component: DashboardComponent},
      {path: 'supplier', component: SupplierComponent},
      {path: 'material', component: MaterialComponent},
      {path: 'shape', component: ShapeComponent},
      {path: 'brand', component: BrandComponent},
      {path: 'origin', component: OriginComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'product', component: AdminProductListComponent},
      {path: 'product/:slug', component: AdminProductDetailsComponent},
      {path: 'product/save', component: AdminProductSaveComponent},
    ],
    // canActivate: [AdminGuard], // Thêm guard vào đây
  },
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      {path: '', component: HomeComponent}
    ],
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
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
