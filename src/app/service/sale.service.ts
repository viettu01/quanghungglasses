import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SupplierDto} from "../dto/supplier.dto";
import {SaleDto} from "../dto/sale.dto";

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiSaleAdminUrl = `${Environment.apiBaseUrl}/admin/sale`;
  private apiSaleUrl = `${Environment.apiBaseUrl}/sale`;
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
    return this.http.get(this.apiSaleAdminUrl, {params: queryParams});
  }

  findAll() {
    return this.http.get(this.apiSaleUrl);
  }

  create(saleDto: SaleDto) {
    return this.http.post(this.apiSaleAdminUrl, saleDto, this.apiConfigUrl);
  }

  update(saleDto: SaleDto) {
    return this.http.put(this.apiSaleAdminUrl, saleDto, this.apiConfigUrl);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiSaleAdminUrl}/${id}`,);
  }
}
