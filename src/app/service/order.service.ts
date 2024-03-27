import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {OrderDto} from "../dto/order.dto";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiOrderAdminUrl = `${Environment.apiBaseUrl}/admin/orders`;
  private apiOrderUrl = `${Environment.apiBaseUrl}/orders`;
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
    return this.http.get(this.apiOrderAdminUrl, {params: queryParams});
  }

  findById(id: number) {
    return this.http.get(`${this.apiOrderAdminUrl}/${id}`);
  }

  create(orderDto: OrderDto) {
    const formData = new FormData();
    formData.append('fullname', orderDto.fullname);
    formData.append('address', orderDto.address);
    formData.append('phone', orderDto.phone);
    formData.append('note', orderDto.note);
    console.log(orderDto.eyeglassPrescriptionImage);
    if (orderDto.eyeglassPrescriptionImage != null)
      formData.append('eyeglassPrescriptionImage', orderDto.eyeglassPrescriptionImage);
    formData.append('paymentMethod', orderDto.paymentMethod);
    formData.append('paymentStatus', orderDto.paymentStatus.toString());
    formData.append('orderStatus', orderDto.orderStatus.toString());
    for (let i = 0; i < orderDto.orderDetails.length; i++) {
      formData.append(`orderDetails[${i}].productDetailsId`, orderDto.orderDetails[i].productDetailsId.toString());
      formData.append(`orderDetails[${i}].quantity`, orderDto.orderDetails[i].quantity.toString());
      formData.append(`orderDetails[${i}].price`, orderDto.orderDetails[i].price.toString());
    }

    return this.http.post(this.apiOrderUrl, formData);
  }
}
