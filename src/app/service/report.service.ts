import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Environment} from "../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiReportAdminUrl = `${Environment.apiBaseUrl}/admin/report`;

  constructor(private http: HttpClient) {
  }

  orderReport(year: number) {
    return this.http.get(`${this.apiReportAdminUrl}/order?year=${year}`);
  }

  receiptReport(year: number) {
    return this.http.get(`${this.apiReportAdminUrl}/receipt?year=${year}`);
  }

  exportOrderReport(year: number) {
    return this.http.get(`${this.apiReportAdminUrl}/order/export?year=${year}`, {
      responseType: 'blob'
    });
  }

  exportReceiptReport(year: number) {
    return this.http.get(`${this.apiReportAdminUrl}/receipt/export?year=${year}`, {
      responseType: 'blob'
    });
  }

  getDashboard() {
    return this.http.get(`${this.apiReportAdminUrl}/get-dashboard`);
  }

  getAllCart() {
    return this.http.get(`${this.apiReportAdminUrl}/get-all-cart`);
  }
}
