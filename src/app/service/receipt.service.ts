import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ReceiptDto} from "../dto/receipt.dto";

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private apiReceiptAdminUrl = `${Environment.apiBaseUrl}/admin/receipt`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient) {
  }

  findAll(nameSearch: string, status: any, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("supplier-name", nameSearch);
    queryParams = queryParams.append("status", status);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiReceiptAdminUrl, {params: queryParams});
  }

  findById(id: number) {
    return this.http.get(`${this.apiReceiptAdminUrl}/${id}`);
  }

  create(receiptDto: ReceiptDto) {
    return this.http.post(this.apiReceiptAdminUrl, receiptDto, this.apiConfigUrl);
  }

  updateStatus(id: number, status: boolean) {
    return this.http.put(`${this.apiReceiptAdminUrl}/${id}/${status}`, null, this.apiConfigUrl);
  }
}
