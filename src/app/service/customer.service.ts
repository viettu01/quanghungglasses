import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CustomerDto} from "../dto/customer.dto";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiCustomerAdminUrl = `${Environment.apiBaseUrl}/admin/customer`;

  constructor(private http: HttpClient) {
  }

  findAll(nameSearch: string, status: any, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("fullname", nameSearch);
    queryParams = queryParams.append("status", status);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiCustomerAdminUrl, {params: queryParams});
  }

  findById(id: number) {
    return this.http.get(`${this.apiCustomerAdminUrl}/${id}`);
  }

  create(customer: CustomerDto) {
    const formData = new FormData();
    formData.append('fullname', customer.fullname);
    formData.append('phone', customer.phone);
    formData.append('gender', customer.gender);
    if (customer.birthday !== null)
      formData.append('birthday', customer.birthday.toString());
    formData.append('address', customer.address);
    if (customer.account.email !== '' && customer.account.password !== '') {
      formData.append('account.email', customer.account.email);
      formData.append('account.password', customer.account.password);
      formData.append('account.status', customer.account.status.toString());
    }
    return this.http.post(this.apiCustomerAdminUrl, formData);
  }

  update(customer: CustomerDto) {
    const formData = new FormData();
    formData.append('id', customer.id.toString());
    formData.append('fullname', customer.fullname);
    formData.append('phone', customer.phone);
    formData.append('gender', customer.gender);
    if (customer.birthday !== null)
      formData.append('birthday', customer.birthday.toString());
    formData.append('address', customer.address);
    // debugger;
    if (customer.account.id !== null) {
      formData.append('account.id', customer.account.id.toString());
      formData.append('account.email', customer.account.email);
      formData.append('account.password', customer.account.password);
      formData.append('account.status', customer.account.status.toString());
    } else {
      if (customer.account.email !== '' && customer.account.password !== '') {
        formData.append('account.email', customer.account.email);
        formData.append('account.password', customer.account.password);
        formData.append('account.status', customer.account.status.toString());
      }
    }
    return this.http.put(this.apiCustomerAdminUrl, formData);
  }
}
