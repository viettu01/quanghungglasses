import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../../service/order.service";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {OrderDto} from "../../../../dto/order.dto";
import {Environment} from "../../../../environment/environment";

@Component({
  selector: 'app-admin-order-details',
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.css']
})
export class AdminOrderDetailsComponent implements OnInit {
  titleString = 'Chi tiết đơn hàng';
  orderDto: OrderDto = OrderDto.createEmpty();
  baseUrl = Environment.apiBaseUrl + '/images/';

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private router: Router,
              private orderService: OrderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);
    this.findById();
    console.log(this.orderDto.paymentStatus);
  }

  findById() {
    this.orderService.findById(this.activatedRoute.snapshot.params["id"]).subscribe({
      next: (data: any) => {
        this.orderDto = data;
        this.orderDto.totalMoney = 0;
        this.orderDto.orderDetails.forEach(orderDetails => {
          orderDetails.totalMoney = orderDetails.quantity * orderDetails.price;
          this.orderDto.totalMoney += orderDetails.totalMoney;
        });
      },
      error: (error) => {
        this.toastr.error('Không tìm thấy đơn hàng', 'Lỗi');
      }
    });
  }
}
