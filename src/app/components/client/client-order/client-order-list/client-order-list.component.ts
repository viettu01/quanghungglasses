import {Component, OnInit} from '@angular/core';
import {Environment} from "../../../../environment/environment";
import {PaginationDTO} from "../../../../dto/pagination.dto";
import {OrderDto} from "../../../../dto/order.dto";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderService} from "../../../../service/order.service";
import {Utils} from 'src/app/utils/utils';

@Component({
  selector: 'app-client-order-list',
  templateUrl: './client-order-list.component.html',
  styleUrls: ['./client-order-list.component.css']
})
export class ClientOrderListComponent implements OnInit {
  protected readonly Utils = Utils;
  protected readonly baseUrl: string = `${Environment.apiBaseUrl}` + '/images/';
  titleString: string = 'Danh sách đơn hàng';

  paginationDTO: PaginationDTO<OrderDto> = PaginationDTO.createEmpty();
  searchTemp: any = this.activatedRoute.snapshot.queryParams['ten-san-pham'] || "";
  sortDir: string = "ASC";
  sortBy: string = "";
  isGetAll: boolean = false;
  isOrderStatus0: boolean = false;
  isOrderStatus1: boolean = false;
  isOrderStatus2: boolean = false;
  isOrderStatus5: boolean = false;
  isOrderStatus6: boolean = false;
  countAll: number = 0;
  countOrderStatus0: number = 0;
  countOrderStatus1: number = 0;
  countOrderStatus2: number = 0;
  countOrderStatus5: number = 0;
  countOrderStatus6: number = 0;

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private router: Router,
              private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);

    this.activatedRoute.queryParams.subscribe(params => {
      const productName = params['ten-san-pham'] || "";
      const orderStatus = params['trang-thai'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(productName, orderStatus, pageSize, pageNumber, sortDir, sortBy);
      this.checkActiveOrderStatus();
    });
    this.getCountAllOrder();
    this.getCountOrderStatus0();
    this.getCountOrderStatus1();
    this.getCountOrderStatus2();
    this.getCountOrderStatus5();
    this.getCountOrderStatus6();
  }

  findAll(productName: string, orderStatus: any, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.orderService.findAllByCustomer(productName, orderStatus, pageSize, pageNumber, sortDir, sortBy).subscribe({
      next: (response: any) => {
        this.paginationDTO.content = response.content;
        // tinh tong tien cua 1 don hang
        this.paginationDTO.content.forEach(order => {
          order.totalMoney = order.orderDetails.reduce((total, orderDetail) => {
            return total + orderDetail.price * orderDetail.quantity;
          }, 0);
        });
        this.paginationDTO.totalPages = response.totalPages;
        this.paginationDTO.totalElements = response.totalElements;
        this.paginationDTO.numberOfElements = response.numberOfElements;
        this.paginationDTO.pageSize = response.pageSize;
        this.paginationDTO.pageNumber = response.pageNumber;
        this.paginationDTO.firstElementOnPage = response.firstElementOnPage;
        this.paginationDTO.lastElementOnPage = response.lastElementOnPage;
        this.paginationDTO.sortBy = response.sortBy;
        this.paginationDTO.sortDirection = response.sortDirection;
      }
    });
  }

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/don-hang'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/don-hang'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/don-hang'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/don-hang'], {
      queryParams: {"ten-san-pham": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  searchByOrderStatus(status: any) {

    this.router.navigate(['/don-hang'], {
      queryParams: {"trang-thai": status, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  checkActiveOrderStatus() {
    this.isGetAll = this.activatedRoute.snapshot.queryParams['trang-thai'] === undefined
      || this.activatedRoute.snapshot.queryParams['trang-thai'] === ""
      || this.activatedRoute.snapshot.queryParams['trang-thai'] === null;
    this.isOrderStatus0 = this.activatedRoute.snapshot.queryParams['trang-thai'] === "0";
    this.isOrderStatus1 = this.activatedRoute.snapshot.queryParams['trang-thai'] === "1";
    this.isOrderStatus2 = this.activatedRoute.snapshot.queryParams['trang-thai'] === "2";
    this.isOrderStatus5 = this.activatedRoute.snapshot.queryParams['trang-thai'] === "5";
    this.isOrderStatus6 = this.activatedRoute.snapshot.queryParams['trang-thai'] === "6";
  }

  getCountAllOrder() {
    this.orderService.findAllByCustomer("", "", 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.countAll = response.totalElements;
      }
    });
  }

  getCountOrderStatus0() {
    this.orderService.findAllByCustomer("", 0, 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.countOrderStatus0 = response.totalElements;
      }
    });
  }

  getCountOrderStatus1() {
    this.orderService.findAllByCustomer("", 1, 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.countOrderStatus1 = response.totalElements;
      }
    });
  }

  getCountOrderStatus2() {
    this.orderService.findAllByCustomer("", 2, 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.countOrderStatus2 = response.totalElements;
      }
    });
  }

  getCountOrderStatus5() {
    this.orderService.findAllByCustomer("", 5, 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.countOrderStatus5 = response.totalElements;
      }
    });
  }

  getCountOrderStatus6() {
    this.orderService.findAllByCustomer("", 6, 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.countOrderStatus6 = response.totalElements;
      }
    });
  }
}
