import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {greaterThanZeroValidator} from "../../../../utils/greater-than-zero-validator";
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../../../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SaleService} from "../../../../service/sale.service";
import {ProductDto} from "../../../../dto/product.dto";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-admin-sale-save',
  templateUrl: './admin-sale-save.component.html',
  styleUrls: ['./admin-sale-save.component.css']
})
export class AdminSaleSaveComponent implements OnInit {
  titleString: string = "";
  products: ProductDto[] = [];

  isDisplayNone: boolean = false;
  btnSave: string = "";

  saleForm: FormGroup = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      saleDetails: new FormArray([
        new FormGroup({
          id: new FormControl(null),
          productId: new FormControl(null, [Validators.required]),
          discount: new FormControl('', [Validators.required, Validators.max(100), greaterThanZeroValidator])
        })
      ], Validators.required)
    }
  );

  get saleDetails() {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  addProductDetails() {
    const saleDetails = this.saleForm.get('saleDetails') as FormArray;
    saleDetails.push(
      new FormGroup({
        id: new FormControl(null),
        productId: new FormControl(null, [Validators.required]),
        discount: new FormControl('', [Validators.required, Validators.max(100), greaterThanZeroValidator])
      })
    );
  }

  removeProductDetails(index: number) {
    const saleDetails = this.saleForm.get('saleDetails') as FormArray;

    if (saleDetails.at(index).get('id')?.value !== null) {
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
          this.saleService.deleteSaleDetail(saleDetails.at(index).get('id')?.value).subscribe({
            next: () => {
              this.toastr.success("Xóa sản phẩm thành công");
              saleDetails.removeAt(index);
            },
            error: (error: any) => {
              if (error.status === 400)
                this.toastr.error(error.error);
              else
                this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
            }
          });
        }
      });
    } else {
      saleDetails.removeAt(index);
    }
  }

  constructor(private title: Title, private datePipe: DatePipe,
              private productService: ProductService, private saleService: SaleService,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.titleString = "Thêm chương trình khuyến mãi";
      this.btnSave = "Thêm mới";
    } else {
      this.titleString = "Cập nhật chương trình khuyến mãi";
      this.btnSave = "Cập nhật";
      this.findSaleById(this.activatedRoute.snapshot.params["id"]);
    }

    this.title.setTitle(this.titleString);
    this.findAllProduct()
  }

  onSubmit() {
    if (this.saleForm.invalid) {
      return;
    }
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.createSale();
    } else {
      this.updateSale();
    }
  }

  findAllProduct() {
    this.productService.findAll().subscribe({
      next: (response: any) => {
        this.products = response.content;
      }
    });
  }

  findSaleById(id: number) {
    this.saleService.findById(id).subscribe({
      next: (response: any) => {
        this.saleForm.patchValue(response);
        this.saleForm.get('startDate')?.setValue(this.datePipe.transform(response.startDate, 'yyyy-MM-dd'));
        this.saleForm.get('endDate')?.setValue(this.datePipe.transform(response.endDate, 'yyyy-MM-dd'));
        this.saleForm.setControl('saleDetails', new FormArray([]));
        response.saleDetails.forEach((saleDetail: any) => {
          this.saleDetails.push(
            new FormGroup({
              id: new FormControl(saleDetail.id),
              productId: new FormControl(saleDetail.product.id, [Validators.required]),
              discount: new FormControl(saleDetail.discount, [Validators.required, Validators.max(100), greaterThanZeroValidator])
            })
          );
        });
      }
    });
  }

  createSale() {
    this.saleService.create(this.saleForm.value).subscribe({
      next: () => {
        this.toastr.success("Thêm chương trình khuyến mãi thành công");
        this.router.navigateByUrl("/admin/sale");
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }

  updateSale() {
    this.saleService.update(this.saleForm.value).subscribe({
      next: () => {
        this.toastr.success("Cập nhật chương trình khuyến mãi thành công");
        this.router.navigateByUrl("/admin/sale");
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }
}
