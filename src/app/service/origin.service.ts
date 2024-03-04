import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {OriginDto} from "../dto/origin.dto";

@Injectable({
  providedIn: 'root'
})
export class OriginService {
  private apiOriginAdminUrl = `${Environment.apiBaseUrl}/admin/origin`;
  private apiOriginUrl = `${Environment.apiBaseUrl}/origin`;
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
    return this.http.get(this.apiOriginAdminUrl, {params: queryParams});
  }

  findAll() {
    return this.http.get(this.apiOriginUrl);
  }

  create(originDto: OriginDto) {
    return this.http.post(this.apiOriginAdminUrl, originDto, this.apiConfigUrl);
  }

  update(originDto: OriginDto) {
    return this.http.put(this.apiOriginAdminUrl, originDto, this.apiConfigUrl);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiOriginAdminUrl}/${id}`,);
  }
}
