import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {StaffDto} from "../dto/staff.dto";

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiStaffAdminUrl = `${Environment.apiBaseUrl}/admin/staff`;

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
    return this.http.get(this.apiStaffAdminUrl, {params: queryParams});
  }

  findById(id: number) {
    return this.http.get(`${this.apiStaffAdminUrl}/${id}`);
  }

  create(staff: StaffDto) {
    const formData = new FormData();
    formData.append('fullname', staff.fullname);
    formData.append('phone', staff.phone);
    formData.append('gender', staff.gender);
    if (staff.birthday !== null)
      formData.append('birthday', staff.birthday.toString());
    formData.append('status', staff.status.toString());
    if (staff.account.email !== '' && staff.account.password !== '') {
      formData.append('account.email', staff.account.email);
      formData.append('account.password', staff.account.password);
      formData.append('account.status', staff.account.status.toString());
      for (let i = 0; i < staff.account.roleIds.length; i++) {
        formData.append('account.roleIds', staff.account.roleIds[i].toString());
      }
    }
    return this.http.post(this.apiStaffAdminUrl, formData);
  }

  update(staff: StaffDto) {
    const formData = new FormData();
    formData.append('id', staff.id.toString());
    formData.append('fullname', staff.fullname);
    formData.append('phone', staff.phone);
    formData.append('gender', staff.gender);
    if (staff.birthday !== null)
      formData.append('birthday', staff.birthday.toString());
    formData.append('status', staff.status.toString());
    if (staff.account.id !== null) {
      formData.append('account.id', staff.account.id.toString());
      formData.append('account.email', staff.account.email);
      formData.append('account.password', staff.account.password);
      formData.append('account.status', staff.account.status.toString());
      for (let i = 0; i < staff.account.roleIds.length; i++) {
        formData.append('account.roleIds', staff.account.roleIds[i].toString());
      }
    } else {
      if (staff.account.email !== '' && staff.account.password !== '') {
        formData.append('account.email', staff.account.email);
        formData.append('account.password', staff.account.password);
        formData.append('account.status', staff.account.status.toString());
        for (let i = 0; i < staff.account.roleIds.length; i++) {
          formData.append('account.roleIds', staff.account.roleIds[i].toString());
        }
      }
    }
    return this.http.put(this.apiStaffAdminUrl, formData);
  }
}
