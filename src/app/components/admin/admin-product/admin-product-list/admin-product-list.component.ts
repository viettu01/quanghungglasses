import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {CategoryService} from "../../../../service/category.service";
import {ProductService} from "../../../../service/product.service";
import {CategoryDto} from "../../../../dto/category.dto";
import {PaginationDTO} from "../../../../dto/pagination.dto";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Utils} from 'src/app/utils/utils';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {ProductDto} from "../../../../dto/product.dto";
import {Environment} from "../../../../environment/environment";

@Component({
  selector: 'app-list-product',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css']
})
export class AdminProductListComponent implements OnInit {
  protected readonly Utils = Utils;
  baseUrl: string = `${Environment.apiBaseUrl}`;
  paginationDTO: PaginationDTO<ProductDto> = PaginationDTO.createEmpty();
  categories: CategoryDto[] = [];
  countStatusAll: number = 0;
  countStatusTrue: number = 0;
  countStatusFalse: number = 0;
  countProductSale: number = 0;
  isStatusAll: boolean = false;
  isStatusTrue: boolean = false;
  isStatusFalse: boolean = false;
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  selectAll: boolean = false;
  sortDir: string = "ASC";
  sortBy: string = "";

  constructor(private title: Title, private categoryService: CategoryService, private productService: ProductService,
              private activatedRoute: ActivatedRoute, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.title.setTitle("Danh sách sản phẩm");
    this.findAllCategory();
    this.countAll();
    this.countByStatus(true);
    this.countByStatus(false);
    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['name'] || "";
      const status = params['status'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      if (status === 'true') {
        this.isStatusAll = false;
        this.isStatusTrue = true;
        this.isStatusFalse = false;
      } else if (status === 'false') {
        this.isStatusAll = false;
        this.isStatusTrue = false;
        this.isStatusFalse = true;
      } else {
        this.isStatusAll = true;
        this.isStatusTrue = false;
        this.isStatusFalse = false;
      }

      this.findAll(name, status, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  findAllCategory() {
    this.categoryService.findAllByName("", true, 100, 1, "ASC", "name").subscribe(
      (data: any) => {
        this.categories = data.content;
      }
    );
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
  }

  findAll(name: string, status: any, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.productService.findAllByName(name, status, pageSize, pageNumber, sortDir, sortBy).subscribe({
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
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  countByStatus(status: boolean) {
    this.productService.countByStatus(status).subscribe({
      next: (response: any) => {
        if (status)
          this.countStatusTrue = response.totalElements;
        else
          this.countStatusFalse = response.totalElements;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  countAll() {
    this.productService.countAll().subscribe({
      next: (response: any) => {
        this.countStatusAll = response.totalElements;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/admin/product'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/product'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  findAllByStatus(status: boolean) {
    this.router.navigate(['/admin/product'], {queryParams: {'status': status}}).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/product'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/product'], {
      queryParams: {"name": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  // updateStatus(category: CategoryDto) {
  //   this.productForm.patchValue({
  //     id: category.id,
  //     name: category.name,
  //     slug: category.slug,
  //     status: !category.status
  //   });
  //   this.categoryService.update(this.productForm.value).subscribe({
  //     next: () => {
  //       this.updateTable();
  //       this.toastr.success('Cập nhật trạng thái thành công', 'Thông báo');
  //     },
  //     error: (error: any) => {
  //       this.toastr.error('Cập nhật trạng thái thất bại', 'Thất bại');
  //     }
  //   });
  // }

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
        this.categoryService.delete(id).subscribe({
          next: () => {
            this.updateTable();
            this.toastr.success('Xóa sản phẩm thành công', 'Thông báo');
          },
          error: (error: any) => {
            this.toastr.error(error.error, 'Thất bại');
          }
        });
      }
    })
  }

  updateTable() {
    this.countByStatus(true);
    this.countByStatus(false);
    this.countAll();
    this.findAll("", "", this.paginationDTO.pageSize, 1, "", "");
  }
}
