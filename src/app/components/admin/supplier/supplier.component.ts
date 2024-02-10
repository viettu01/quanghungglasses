import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PaginationDTO} from "../../../dto/pagination.dto";
import {CategoryDto} from "../../../dto/category.dto";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {CategoryService} from "../../../service/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import slugify from 'slugify';
import {Utils} from "../../../utils/utils";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  protected readonly Utils = Utils;
  paginationDTO: PaginationDTO<CategoryDto> = new PaginationDTO<CategoryDto>([], 0, 0, 0, 0, 0, 0, 0, "", "");
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  selectAll: boolean = false;
  sortDir: string = "ASC";
  sortBy: string = "";
  slug: string = "";

  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef;
  titleModal: string = "";
  btnSave: string = "";
  isDisplayNone: boolean = false;
  errorMessage: string = "";
  categoryForm: FormGroup = new FormGroup(
    {
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      slug: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9-]*$/)
      ]),
      description: new FormControl('', [Validators.maxLength(100)]),
      status: new FormControl('false', [Validators.required]),
    }
  );

  constructor(private title: Title, private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.title.setTitle("Quản lý nhà cung cấp");
    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['name'] || "";
      const status = params['status'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(name, status, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
  }

  findAll(name: string, status: any, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.categoryService.findAll(name, status, pageSize, pageNumber, sortDir, sortBy).subscribe({
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

  changePageNumber(pageNumber: number): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  findAllByStatus(status: boolean) {
    this.router.navigate(['/admin/category'], {queryParams: {'status': status}}).then(r => {
    });
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/category'], {
      queryParams: {"name": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  onSubmit() {
    // debugger;
    if (this.categoryForm.invalid) {
      return;
    }
    if (this.categoryForm.value.id == null)
      this.create();
    else
      this.update();
  }

  create() {
    this.isDisplayNone = true;
    this.categoryService.create(this.categoryForm.value).subscribe({
      next: (response: any) => {
        this.categoryForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Thêm danh mục thành công', 'Thông báo');
      },
      error: (error: any) => {
        this.errorMessage = error.error;
        this.isDisplayNone = false;
      }
    });
  }

  update() {
    this.isDisplayNone = true;
    this.categoryService.update(this.categoryForm.value).subscribe({
      next: (response: any) => {
        this.categoryForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Cập nhật danh mục thành công', 'Thông báo');
      },
      error: (error: any) => {
        this.errorMessage = error.error;
        this.isDisplayNone = false;
      }
    });
  }

  updateStatus(category: CategoryDto) {
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      slug: category.slug,
      status: !category.status
    });
    this.categoryService.update(this.categoryForm.value).subscribe({
      next: (response: any) => {
        this.updateTable();
      },
      error: (error: any) => {
        this.errorMessage = error.error;
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
        this.categoryService.delete(id).subscribe({
          next: (response: any) => {
            this.updateTable();
            this.toastr.success('Xóa danh mục thành công', 'Thông báo');
          },
          error: (error: any) => {
            this.toastr.error(error.error, 'Thất bại');
          }
        });
      }
    })
  }

  detail(id: number) {

  }

  openModalCreate() {
    this.categoryForm.reset();
    this.categoryForm.patchValue({
      status: 'false'
    });
    this.titleModal = "Thêm nhà cung cấp";
    this.btnSave = "Thêm mới";
  }

  openModalUpdate(category: CategoryDto) {
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      slug: category.slug,
      status: category.status.toString()
    });
    this.titleModal = "Cập nhật nhà cung cấp";
    this.btnSave = "Cập nhật";
  }

  updateTable() {
    this.isDisplayNone = false;
    this.errorMessage = "";
    this.findAll("", "", this.paginationDTO.pageSize, 1, "", "");
  }
}
