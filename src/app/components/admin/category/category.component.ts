import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {Title} from "@angular/platform-browser";
import {PaginationDTO} from "../../../dto/pagination.dto";
import {CategoryDto} from "../../../dto/category.dto";
import {Environment} from "../../../environment/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  protected readonly Environment = Environment;
  paginationDTO: PaginationDTO<CategoryDto> = new PaginationDTO<CategoryDto>([], 0, 0, 0, 0, 0, 0, 0, "", "");
  countAll: number = 0;
  countStatusTrue: number = 0;
  countStatusFalse: number = 0;
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  sizeSelected: any = [];
  selectAll: boolean = false;
  sortDir: string = "ASC";

  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef;
  titleModal: string = "";
  btnSave: string = "";
  isDisplayNone: boolean = false;
  errorMessage: string = "";
  categoryForm: FormGroup = new FormGroup(
    {
      id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      slug: new FormControl('', [Validators.required]),
      status: new FormControl('false', [Validators.required]),
    }
  );

  constructor(private title: Title, private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute, private router: Router) {
    this.title.setTitle("Quản lý danh mục");
    this.findAllByNonStatus();
    this.findAllByStatus(true);
    this.findAllByStatus(false);
  }

  ngOnInit() {
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

  findAllByStatus(status: boolean) {
    this.categoryService.findAllByStatus(status).subscribe({
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

  findAllByNonStatus() {
    this.categoryService.findAllNonStatus().subscribe({
      next: (response: any) => {
        this.countAll = response.totalElements;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  changePage(pageNumber: number): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  getVisiblePages(currentPage: number, totalPages: number, visibleCount: number): number[] {
    // start = Giá trị nhỏ nhất của trang hiển thị
    // end = Giá trị lớn nhất của trang hiển thị
    let start = Math.max(1, Math.min(currentPage - Math.floor(visibleCount / 2), totalPages - visibleCount + 1));
    let end = Math.min(totalPages, start + visibleCount - 1);

    return Array.from({length: end - start + 1}, (_, index) => start + index);
  }

  getListByStatus(status: boolean) {
    this.router.navigate(['/admin/category'], {queryParams: {"status": status}}).then(r => {
    });
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"page-size": pageSize},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/category'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
  }

  search() {
    this.router.navigate(['/admin/category'], {
      queryParams: {"name": this.searchTemp},
      queryParamsHandling: 'merge'
    }).then(r => {
    });
  }

  onSubmit() {
    // debugger;
    if (this.categoryForm.invalid) {
      return;
    }
    this.save();
  }

  save() {
    this.isDisplayNone = true;
    this.categoryService.save(this.categoryForm.value).subscribe({
      next: (response: any) => {
        this.categoryForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
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
    console.log(this.categoryForm.value);
    this.categoryService.save(this.categoryForm.value).subscribe({
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
        this.categoryService.delete([id]).subscribe({
          next: (response: any) => {
            this.updateTable();
          },
          error: (error: any) => {
            // debugger;
            console.log(error);
          }
        });
      }
    })
  }

  openModalCreate() {
    this.categoryForm.reset();
    this.categoryForm.patchValue({
      status: 'false'
    });
    this.titleModal = "Thêm danh mục";
    this.btnSave = "Thêm mới";
  }

  openModalUpdate(category: CategoryDto) {
    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      slug: category.slug,
      status: category.status.toString()
    });
    this.titleModal = "Cập nhật danh mục";
    this.btnSave = "Cập nhật";
  }

  updateTable() {
    this.isDisplayNone = false;
    this.errorMessage = "";
    this.findAllByStatus(true);
    this.findAllByStatus(false);
    this.findAllByNonStatus();
    this.findAll(this.searchTemp, "", 10, 1, "", "");
  }
}
