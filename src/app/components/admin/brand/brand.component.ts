import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PaginationDTO} from "../../../dto/pagination.dto";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {Utils} from 'src/app/utils/utils';
import {BrandDto} from "../../../dto/brand.dto";
import {BrandService} from "../../../service/brand.service";
import {TokenService} from "../../../service/token.service";

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  roles: string[] = this.tokenService.getUserRoles();
  protected readonly Utils = Utils;
  paginationDTO: PaginationDTO<BrandDto> = PaginationDTO.createEmpty();
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  selectAll: boolean = false;
  sortDir: string = "ASC";
  sortBy: string = "";

  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef;
  titleModal: string = "";
  btnSave: string = "";
  isDisplayNone: boolean = false;
  brandForm: FormGroup = new FormGroup(
    {
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(50)])
    }
  );

  constructor(private title: Title, private brandService: BrandService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService, private tokenService: TokenService) {
  }

  ngOnInit() {
    this.title.setTitle("Quản lý thương hiệu");
    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['name'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(name, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
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
    this.router.navigate(['/admin/brand'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/brand'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/brand'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/brand'], {
      queryParams: {"name": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  onSubmit() {
    if (this.brandForm.invalid)
      return;
    if (this.brandForm.value.id == null)
      this.create();
    else
      this.update();
  }

  create() {
    this.isDisplayNone = true;
    this.brandService.create(this.brandForm.value).subscribe({
      next: () => {
        this.brandForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Thêm thương hiệu thành công');
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        this.isDisplayNone = false;
      }
    });
  }

  update() {
    this.isDisplayNone = true;
    this.brandService.update(this.brandForm.value).subscribe({
      next: () => {
        this.brandForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Cập nhật thương hiệu thành công');
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        this.isDisplayNone = false;
      }
    });
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
            this.updateTable();
            this.toastr.success('Xóa thương hiệu thành công');
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

  openModalCreate() {
    this.brandForm.reset();
    this.titleModal = "Thêm thương hiệu";
    this.btnSave = "Thêm mới";
  }

  openModalUpdate(brandDto: BrandDto) {
    this.brandForm.patchValue({
      id: brandDto.id,
      name: brandDto.name
    });
    this.titleModal = "Cập nhật thương hiệu";
    this.btnSave = "Cập nhật";
  }

  updateTable() {
    this.isDisplayNone = false;
    this.findAll("", this.paginationDTO.pageSize, 1, "", "");
  }
}
