import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../../service/category.service";
import {Title} from "@angular/platform-browser";
import {PaginationDTO} from "../../../dto/pagination.dto";
import {CategoryDto} from "../../../dto/category.dto";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import slugify from 'slugify';
import {Utils} from "../../../utils/utils";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  protected readonly Utils = Utils;
  paginationDTO: PaginationDTO<CategoryDto> = new PaginationDTO<CategoryDto>([], 0, 0, 0, 0, 0, 0, 0, "", "");
  countStatusAll: number = 0;
  countStatusTrue: number = 0;
  countStatusFalse: number = 0;
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
              private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.title.setTitle("Quản lý danh mục");
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

  countByStatus(status: boolean) {
    this.categoryService.countByStatus(status).subscribe({
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
    this.categoryService.countAll().subscribe({
      next: (response: any) => {
        this.countStatusAll = response.totalElements;
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

  slugify() {
    this.categoryForm.patchValue({
      slug: slugify(this.categoryForm.value.name, {
          lower: true,
          remove: /[*+~.,()'"!:@]/g,
          locale: 'en',
          trim: true,
          strict: true
        },
      )
    });
  }

  updateTable() {
    this.isDisplayNone = false;
    this.errorMessage = "";
    this.countByStatus(true);
    this.countByStatus(false);
    this.countAll();
    this.router.navigate(['/admin/category'], {queryParams: {'page-number': 1}})
      .then(r => {
      });
  }
}
