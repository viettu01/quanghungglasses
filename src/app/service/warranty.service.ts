import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {WarrantyDto} from "../dto/warranty.dto";

@Injectable({
  providedIn: 'root'
})
export class WarrantyService {
  private apiWarrantyAdminUrl = `${Environment.apiBaseUrl}/admin/warranty`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient) {
  }

  findAll(fullname: string, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("fullname", fullname);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiWarrantyAdminUrl, {params: queryParams});
  }

  findById(id: number) {
    return this.http.get(`${this.apiWarrantyAdminUrl}/${id}`);
  }

  create(warrantyDto: WarrantyDto) {
    return this.http.post(this.apiWarrantyAdminUrl, warrantyDto, this.apiConfigUrl);
  }

  update(id: number, status: boolean) {
    return this.http.put(`${this.apiWarrantyAdminUrl}/${id}?status=${status}`, this.apiConfigUrl);
  }
}
