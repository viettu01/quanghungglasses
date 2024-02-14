import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PaginationDTO} from "../../../dto/pagination.dto";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {Utils} from 'src/app/utils/utils';
import {ShapeService} from "../../../service/shape.service";
import {ShapeDto} from "../../../dto/shape.dto";

@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.css']
})
export class ShapeComponent implements OnInit {
  protected readonly Utils = Utils;
  paginationDTO: PaginationDTO<ShapeDto> = PaginationDTO.createEmpty();
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  selectAll: boolean = false;
  sortDir: string = "ASC";
  sortBy: string = "";

  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef;
  titleModal: string = "";
  btnSave: string = "";
  isDisplayNone: boolean = false;
  errorMessage: string = "";
  shapeForm: FormGroup = new FormGroup(
    {
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(50)])
    }
  );

  constructor(private title: Title, private shapeService: ShapeService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.title.setTitle("Quản lý hình dạng");
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
    this.shapeService.findAllByName(name, pageSize, pageNumber, sortDir, sortBy).subscribe({
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
    this.router.navigate(['/admin/shape'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/shape'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/shape'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/shape'], {
      queryParams: {"name": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  onSubmit() {
    if (this.shapeForm.invalid) {
      return;
    }
    if (this.shapeForm.value.id == null)
      this.create();
    else
      this.update();
  }

  create() {
    this.isDisplayNone = true;
    this.shapeService.create(this.shapeForm.value).subscribe({
      next: () => {
        this.shapeForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Thêm hình dạng thành công', 'Thông báo');
      },
      error: (error: any) => {
        this.errorMessage = error.error;
        this.isDisplayNone = false;
      }
    });
  }

  update() {
    this.isDisplayNone = true;
    this.shapeService.update(this.shapeForm.value).subscribe({
      next: () => {
        this.shapeForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Cập nhật hình dạng thành công', 'Thông báo');
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
        this.shapeService.delete(id).subscribe({
          next: () => {
            this.updateTable();
            this.toastr.success('Xóa hình dạng thành công', 'Thông báo');
          },
          error: (error: any) => {
            this.toastr.error(error.error, 'Thất bại');
          }
        });
      }
    })
  }

  openModalCreate() {
    this.shapeForm.reset();
    this.titleModal = "Thêm hình dạng";
    this.btnSave = "Thêm mới";
  }

  openModalUpdate(shapeDto: ShapeDto) {
    this.shapeForm.patchValue({
      id: shapeDto.id,
      name: shapeDto.name
    });
    this.titleModal = "Cập nhật hình dạng";
    this.btnSave = "Cập nhật";
  }

  updateTable() {
    this.isDisplayNone = false;
    this.errorMessage = "";
    this.findAll("", this.paginationDTO.pageSize, 1, "", "");
  }
}
