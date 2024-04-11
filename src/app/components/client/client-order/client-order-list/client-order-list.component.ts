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
  searchTemp: any = this.activatedRoute.snapshot.queryParams['fullname'] || "";
  sortDir: string = "ASC";
  sortBy: string = "";

  constructor(private title: Title, private activatedRoute: ActivatedRoute, private router: Router,
              private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);

    this.activatedRoute.queryParams.subscribe(params => {
      const productName = params['product-name'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(productName, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  findAll(productName: string, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.orderService.findAllByCustomer(productName, pageSize, pageNumber, sortDir, sortBy).subscribe({
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
      queryParams: {"product-name": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }
}
