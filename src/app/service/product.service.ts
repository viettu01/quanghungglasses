import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CategoryDto} from "../dto/category.dto";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiProductAdminUrl = `${Environment.apiBaseUrl}/admin/product`;
  private apiProductUrl = `${Environment.apiBaseUrl}/product`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient) {

  }

  findAllByName(nameSearch: string = "", status: boolean, pageSize: number, pageNumber: any, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", nameSearch);
    queryParams = queryParams.append("status", status);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiProductAdminUrl, {params: queryParams});
  };

  findAll() {
    return this.http.get(this.apiProductUrl);
  };

  findBySlug(slug: string) {
    return this.http.get(`${this.apiProductAdminUrl}/${slug}`);
  }

  countByStatus(status: boolean) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("status", status);
    return this.http.get(`${this.apiProductAdminUrl}/count`, {params: queryParams});
  }

  countAll() {
    return this.http.get(`${this.apiProductAdminUrl}/count-all`);
  }

  create(category: CategoryDto) {
    return this.http.post(this.apiProductAdminUrl, category, this.apiConfigUrl);
  }

  update(category: CategoryDto) {
    return this.http.put(this.apiProductAdminUrl, category, this.apiConfigUrl);
  }

  // delete(ids: number[]) {
  //   const options = {
  //     headers: this.apiConfigUrl.headers,
  //     body: ids // Truyền danh sách ids vào phần body
  //   };
  //
  //   return this.http.delete(`${this.apiCategoryUrl}`, options);
  // }

  delete(id: number) {
    return this.http.delete(`${this.apiProductAdminUrl}/${id}`,);
  }
}
