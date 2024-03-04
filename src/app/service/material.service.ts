import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MaterialDto} from "../dto/material.dto";

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiMaterialAdminUrl = `${Environment.apiBaseUrl}/admin/material`;
  private apiMaterialUrl = `${Environment.apiBaseUrl}/material`;
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
    return this.http.get(this.apiMaterialAdminUrl, {params: queryParams});
  }

  findAll() {
    return this.http.get(this.apiMaterialUrl);
  }

  create(materialDto: MaterialDto) {
    return this.http.post(this.apiMaterialAdminUrl, materialDto, this.apiConfigUrl);
  }

  update(materialDto: MaterialDto) {
    return this.http.put(this.apiMaterialAdminUrl, materialDto, this.apiConfigUrl);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiMaterialAdminUrl}/${id}`,);
  }
}
