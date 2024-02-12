import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SupplierDto} from "../dto/supplier.dto";

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private apiShapeAdminUrl = `${Environment.apiBaseUrl}/admin/shape`;
  private apiShapeUrl = `${Environment.apiBaseUrl}/shape`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient) {

  }

  findAllByName(nameSearch: string = "", pageSize: number, pageNumber: any, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", nameSearch);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiShapeAdminUrl, {params: queryParams});
  }

  findAll() {
    return this.http.get(this.apiShapeUrl);
  }

  create(supplierDto: SupplierDto) {
    return this.http.post(this.apiShapeAdminUrl, supplierDto, this.apiConfigUrl);
  }

  update(supplierDto: SupplierDto) {
    return this.http.put(this.apiShapeAdminUrl, supplierDto, this.apiConfigUrl);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiShapeAdminUrl}/${id}`,);
  }
}
