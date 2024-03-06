import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../../../../service/customer.service";
import {Title} from "@angular/platform-browser";
import {PaginationDTO} from "../../../../dto/pagination.dto";
import {CustomerDto} from "../../../../dto/customer.dto";
import {Utils} from "../../../../utils/utils";
import {Environment} from "../../../../environment/environment";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  protected readonly Utils = Utils;
  protected readonly baseUrl: string = `${Environment.apiBaseUrl}`;
  titleString: string = "Danh sách khách hàng";

  paginationDTO: PaginationDTO<CustomerDto> = PaginationDTO.createEmpty();
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  sortDir: string = "ASC";
  sortBy: string = "";

  constructor(private title: Title, private customerService: CustomerService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.titleString);

    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['fullname'] || "";
      const status = params['status'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(name, status, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  findAll(fullname: string, status: any, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.customerService.findAll(fullname, status, pageSize, pageNumber, sortDir, sortBy).subscribe({
      next: (response: any) => {
        this.paginationDTO.content = response.content;
        this.paginationDTO.totalPages = response.totalPages;
        this.paginationDTO.totalElements = response.totalElements;
        this.paginationDTO.numberOfElements = response.numberOfElements;
        this.paginationDTO.pageSize = response.pageSize;
        this.paginationDTO.pageNumber = response.pageNumber;
        this.paginationDTO.firstElementOnPage = response.firstElementOnPage;
        this.paginationDTO.lastElementOnPage = response.lastElementOnPage;
        this.paginationDTO.sortBy = response.sortBy;
        this.paginationDTO.sortDirection = response.sortDirection;

        console.log(this.paginationDTO.content);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/admin/customer'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/customer'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/customer'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/customer'], {
      queryParams: {"fullname": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }
}
