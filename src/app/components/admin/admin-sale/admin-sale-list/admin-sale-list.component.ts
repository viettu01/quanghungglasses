import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SaleService} from "../../../../service/sale.service";
import {PaginationDTO} from "../../../../dto/pagination.dto";
import {Utils} from 'src/app/utils/utils';
import Swal from "sweetalert2";
import {SaleDto} from "../../../../dto/sale.dto";
import {TokenService} from "../../../../service/token.service";

@Component({
  selector: 'app-admin-sale-list',
  templateUrl: './admin-sale-list.component.html',
  styleUrls: ['./admin-sale-list.component.css']
})
export class AdminSaleListComponent implements OnInit {
  roles: string[] = this.tokenService.getUserRoles();
  protected readonly Utils = Utils;
  paginationDTO: PaginationDTO<SaleDto> = PaginationDTO.createEmpty();
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  selectAll: boolean = false;
  sortDir: string = "ASC";
  sortBy: string = "";

  constructor(private title: Title, private brandService: SaleService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService, private tokenService: TokenService) {
  }

  ngOnInit() {
    this.title.setTitle("Chương trình khuyến mãi");
    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['name'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(name, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  findAll(name: string, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.brandService.findAllByName(name, pageSize, pageNumber, sortDir, sortBy).subscribe({
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
      },
      error: () => {
      }
    });
  }

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/admin/sale'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/sale'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/sale'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/sale'], {
      queryParams: {"name": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  delete(id: number) {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Dữ liệu sẽ không thể phục hồi sau khi xóa!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger me-1',
        cancelButton: 'btn btn-secondary'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.brandService.delete(id).subscribe({
          next: () => {
            this.findAll("", this.paginationDTO.pageSize, 1, "", "");
            this.toastr.success('Xóa chương trình khuyến mãi thành công');
          },
          error: (error: any) => {
            if (error.status === 400)
              this.toastr.error(error.error);
            else
              this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
          }
        });
      }
    })
  }
}
