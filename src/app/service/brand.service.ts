import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BrandDto} from "../dto/brand.dto";

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiBrandAdminUrl = `${Environment.apiBaseUrl}/admin/brand`;
  private apiBrandUrl = `${Environment.apiBaseUrl}/brand`;
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
    return this.http.get(this.apiBrandAdminUrl, {params: queryParams});
  }

  findAll() {
    return this.http.get(this.apiBrandUrl);
  }

  create(brandDto: BrandDto) {
    return this.http.post(this.apiBrandAdminUrl, brandDto, this.apiConfigUrl);
  }

  update(brandDto: BrandDto) {
    return this.http.put(this.apiBrandAdminUrl, brandDto, this.apiConfigUrl);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiBrandAdminUrl}/${id}`,);
  }
}
