import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {OrderService} from "../../../../service/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderDto} from "../../../../dto/order.dto";
import {ToastrService} from "ngx-toastr";
import {Environment} from "../../../../environment/environment";

@Component({
  selector: 'app-client-order-details',
  templateUrl: './client-order-details.component.html',
  styleUrls: ['./client-order-details.component.css']
})
export class ClientOrderDetailsComponent implements OnInit {

  orders: OrderDto = OrderDto.createEmpty();
  baseUrl = Environment.apiBaseUrl + '/images/';

  constructor(private title: Title, private toastr: ToastrService,
              private router: Router, private activatedRoute: ActivatedRoute,
              private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Chi tiết đơn hàng');
    this.findById();
  }

  findById() {
    this.orderService.findByIdWithClient(this.activatedRoute.snapshot.params["id"]).subscribe({
      next: (data: any) => {
        this.orders = data;
        console.log(this.orders);
        this.orders.totalMoney = 0;
        this.orders.orderDetails.forEach(orderDetails => {
          orderDetails.totalMoney = orderDetails.quantity * orderDetails.price;
          this.orders.totalMoney += orderDetails.totalMoney;
        });
      }
      ,
      error: (error: any) => {
        if (error.status == 404) {
          this.router.navigateByUrl('/don-hang').then();
          this.toastr.error(error.error);
        } else {
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        }
      }
    })
  }
}
