import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiStaffAdminUrl = `${Environment.apiBaseUrl}/admin/staff`;
  private apiCategoryUrl = `${Environment.apiBaseUrl}`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

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
}
