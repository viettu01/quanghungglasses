import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PaginationDTO} from "../../../dto/pagination.dto";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {Utils} from 'src/app/utils/utils';
import {BannerDto} from "../../../dto/banner.dto";
import {Environment} from "../../../environment/environment";
import {BannerService} from "../../../service/banner.service";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  protected readonly Utils = Utils;
  baseUrl: string = `${Environment.apiBaseUrl}`;
  paginationDTO: PaginationDTO<BannerDto> = new PaginationDTO<BannerDto>([], 0, 0, 0, 0, 0, 0, 0, "", "");
  bannerDetails: BannerDto = new BannerDto(new Date(), new Date(), 0, "", "", false, "");
  searchTemp: any = this.activatedRoute.snapshot.queryParams['name'] || "";
  selectAll: boolean = false;
  sortDir: string = "ASC";
  sortBy: string = "";

  @ViewChild('btnCloseModal') btnCloseModal!: ElementRef;
  titleModal: string = "";
  btnSave: string = "";
  isDisplayNone: boolean = false;
  errorMessage: string = "";
  selectedImageUrl: string = "";
  selectedImageFile: File = new File([""], "filename");
  bannerForm: FormGroup = new FormGroup(
    {
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      // multipartFileImage: new FormControl(null, [Validators.required]),
      multipartFileImage: new FormControl(null),
      status: new FormControl('false', [Validators.required])
    }
  );

  constructor(private title: Title, private bannerService: BannerService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
    // Thêm Validators.required cho multipartFileImage dựa trên giá trị của id
    this.bannerForm.get('id')?.valueChanges.subscribe((id) => {
      const multipartFileImageControl = this.bannerForm.get('multipartFileImage');
      if (id !== null) {
        multipartFileImageControl?.setValidators([Validators.nullValidator]);
      } else {
        multipartFileImageControl?.setValidators([Validators.required]);
      }

      multipartFileImageControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.title.setTitle("Quản lý banner");
    this.activatedRoute.queryParams.subscribe(params => {
      const name = params['name'] || "";
      const pageSize = +params['page-size'] || 10;
      const pageNumber = +params['page-number'] || 1;
      const sortDir = params['sort-direction'] || "";
      const sortBy = params['sort-by'] || "";

      this.findAll(name, pageSize, pageNumber, sortDir, sortBy);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedImageFile = file;
    if (file) {
      // Đọc đường dẫn tệp hình ảnh và cập nhật selectedImageUrl
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
        // console.log(this.selectedImageFile);
      };
      reader.readAsDataURL(file);
    }
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
  }

  findAll(name: string, pageSize: number, pageNumber: number, sortDir: string, sortBy: string) {
    this.bannerService.findAllByName(name, pageSize, pageNumber, sortDir, sortBy).subscribe({
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
    this.router.navigate(['/admin/banner'], {
      queryParams: {"page-number": pageNumber},
      queryParamsHandling: 'merge'
    }).then();
  }

  changePageSize(pageSize: number): void {
    this.router.navigate(['/admin/banner'], {
      queryParams: {'page-size': pageSize, 'page-number': 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  sortByField(sortBy: string): void {
    this.router.navigate(['/admin/banner'], {
      queryParams: {"sort-by": sortBy, "sort-direction": this.sortDir},
      queryParamsHandling: 'merge'
    }).then();
    this.sortDir = this.sortDir === "ASC" ? "DESC" : "ASC";
    this.sortBy = sortBy;
  }

  search() {
    this.router.navigate(['/admin/banner'], {
      queryParams: {"name": this.searchTemp, "page-number": 1},
      queryParamsHandling: 'merge'
    }).then();
  }

  onSubmit() {
    if (this.bannerForm.invalid) {
      return;
    }
    if (this.bannerForm.value.id == null)
      this.create();
    else
      this.update();
  }

  create() {
    this.isDisplayNone = true;
    this.bannerService.create(this.bannerForm.value, this.selectedImageFile).subscribe({
      next: () => {
        this.bannerForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Thêm banner thành công', 'Thông báo');
      },
      error: (error: any) => {
        this.errorMessage = error.error;
        this.isDisplayNone = false;
      }
    });
  }

  update() {
    this.isDisplayNone = true;
    this.bannerService.update(this.bannerForm.value, this.selectedImageFile).subscribe({
      next: () => {
        this.bannerForm.reset();
        this.btnCloseModal.nativeElement.click();
        this.updateTable();
        this.toastr.success('Cập nhật banner thành công', 'Thông báo');
      },
      error: (error: any) => {
        this.errorMessage = error.error;
        this.isDisplayNone = false;
      }
    });
  }

  updateStatus(bannerDto: BannerDto) {
    this.bannerForm.patchValue({
      id: bannerDto.id,
      name: bannerDto.name,
      status: !bannerDto.status
    });
    this.bannerService.update(this.bannerForm.value, this.selectedImageFile).subscribe({
      next: () => {
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
        this.bannerService.delete(id).subscribe({
          next: () => {
            this.updateTable();
            this.toastr.success('Xóa banner thành công', 'Thông báo');
          },
          error: (error: any) => {
            this.toastr.error(error.error, 'Thất bại');
          }
        });
      }
    })
  }

  detail(id: number) {
    this.bannerService.findById(id).subscribe({
      next: (response: any) => {
        console.log(response);
        this.bannerDetails = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  openModalCreate() {
    this.bannerForm.reset();
    this.bannerForm.patchValue({
      status: 'false'
    });
    this.selectedImageFile = new File([""], "filename");
    this.selectedImageUrl = "";
    this.titleModal = "Thêm banner";
    this.btnSave = "Thêm mới";
  }

  openModalUpdate(bannerDto: BannerDto) {
    this.bannerForm.patchValue({
      id: bannerDto.id,
      name: bannerDto.name,
      status: bannerDto.status.toString()
    });
    this.selectedImageFile = new File([""], "filename");
    this.selectedImageUrl = `${this.baseUrl}/images/${bannerDto.image}`;
    this.titleModal = "Cập nhật banner";
    this.btnSave = "Cập nhật";
  }

  updateTable() {
    this.isDisplayNone = false;
    this.errorMessage = "";
    this.findAll("", this.paginationDTO.pageSize, 1, "", "");
  }
}
