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

  // tao 1 danh sach cac gia tri cua orderStatus
  orderStatus = [
    {id: 0, name: 'Chờ xác nhận'},
    {id: 1, name: 'Đã xác nhận'},
    {id: 2, name: 'Đang giao hàng'},
    {id: 3, name: 'Đã giao hàng'},
    {id: 4, name: 'Đã nhận hàng'},
    {id: 5, name: 'Đã hoàn thành'},
    {id: 6, name: 'Đã hủy'}
  ];

  orderStatusInDb: any = 0;

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private router: Router,
              private orderService: OrderService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);
    this.findById();
  }

  findById() {
    this.orderService.findById(this.activatedRoute.snapshot.params["id"]).subscribe({
      next: (data: any) => {
        this.orderDto = data;
        this.orderStatusInDb = data.orderStatus;
        this.orderDto.totalMoney = 0;
        this.orderDto.orderDetails.forEach(orderDetails => {
          orderDetails.totalMoney = orderDetails.quantity * orderDetails.price;
          this.orderDto.totalMoney += orderDetails.totalMoney;
        });
      },
      error: (error: any) => {
        if (error.status == 400) {
          this.router.navigateByUrl('/admin/order');
          this.toastr.error(error.error);
        } else {
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        }
      }
    });
  }

  updateOrderStatus() {
    this.orderService.updateOrderStatus(this.orderDto.id, this.orderDto.orderStatus, this.orderDto.cancelReason).subscribe({
      next: () => {
        this.toastr.success('Cập nhật trạng thái đơn hàng thành công');
        this.findById();
      },
      error: (error: any) => {
        if (error.status == 404)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }
}
