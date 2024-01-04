import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {CategoryDto} from "../dto/category.dto";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiCategoryUrl = `${Environment.apiBaseUrl}/category`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient) {

  }

  findAll(nameSearch: string, status: boolean, pageSize: number, pageNumber: any, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", nameSearch);
    queryParams = queryParams.append("status", status);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiCategoryUrl, { params: queryParams });
  };

  findAllByStatus(status: boolean) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("status", status);
    return this.http.get(this.apiCategoryUrl, { params: queryParams });
  }

  findAllNonStatus() {
    let queryParams = new HttpParams();
    return this.http.get(this.apiCategoryUrl, { params: queryParams });
  }

  save(category: CategoryDto) {
    if (category.id != null) {
      return this.http.put(this.apiCategoryUrl, category, this.apiConfigUrl);
    }
    return this.http.post(this.apiCategoryUrl, category, this.apiConfigUrl);
  };

  delete(ids: number[]) {
    const options = {
      headers: this.apiConfigUrl.headers,
      body: ids // Truyền danh sách ids vào phần body
    };

    return this.http.delete(`${this.apiCategoryUrl}`, options);
  }
}
