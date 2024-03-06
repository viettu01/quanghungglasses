import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {NoWhitespaceValidator} from "../../../../utils/no-white-space-validator";
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../../../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SupplierService} from "../../../../service/supplier.service";
import {ProductDto} from "../../../../dto/product.dto";
import {SupplierDto} from "../../../../dto/supplier.dto";
import {ReceiptService} from "../../../../service/receipt.service";

@Component({
  selector: 'app-receipt-save',
  templateUrl: './receipt-save.component.html',
  styleUrls: ['./receipt-save.component.css']
})
export class ReceiptSaveComponent implements OnInit {
  titleString: string = "";
  suppliers: SupplierDto[] = [];
  products: ProductDto[] = [];

  isDisplayNone: boolean = false;
  btnSave: string = "";

  receiptForm: FormGroup = new FormGroup({
      id: new FormControl(null),
      supplierId: new FormControl(null, [Validators.required]),
      status: new FormControl('false', [Validators.required]),
      receiptDetails: new FormArray([
        new FormGroup({
          id: new FormControl(null),
          color: new FormControl('', [Validators.required, NoWhitespaceValidator()]),
          quantity: new FormControl(0)
        })
      ], Validators.required)
    }
  );

  get receiptDetails() {
    return this.receiptForm.get('receiptDetails') as FormArray;
  }

  constructor(private title: Title,
              private supplierService: SupplierService, private productService: ProductService,
              private receiptService: ReceiptService,
              protected activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.titleString = "Thêm hóa đơn nhập hàng";
      this.btnSave = "Thêm mới";
    } else {
      this.titleString = "Cập nhật hóa đơn nhập hàng";
      this.btnSave = "Cập nhật";
      this.findReceiptById(this.activatedRoute.snapshot.params["id"]);
    }
    this.title.setTitle(this.titleString);
    this.findAllSupplier();
    this.findAllProduct();
  }

  addReceiptDetails() {
    const receiptDetails = this.receiptForm.get('receiptDetails') as FormArray;
    receiptDetails.push(
      new FormGroup({
        id: new FormControl(null),
        color: new FormControl('', [Validators.required]),
        quantity: new FormControl(0)
      })
    );
  }

  removeReceiptDetails(index: number) {
    const productDetails = this.receiptForm.get('receiptDetails') as FormArray;
    productDetails.removeAt(index);
  }

  onSubmit() {
    if (this.receiptForm.invalid) {
      return;
    }
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.createProduct();
    } else {
      this.updateStatus();
    }
  }

  findAllSupplier() {
    this.supplierService.findAll().subscribe({
      next: (data: any) => {
        console.log(data);
        this.suppliers = data.content;
      }
    });
  }

  findAllProduct() {
    this.productService.findAll().subscribe(
      (data: any) => {
        this.products = data.content;
      }
    );
  }

  findReceiptById(id: number) {
    this.productService.findById(id).subscribe({
      next: (data: any) => {
        this.receiptForm.patchValue(data);
        this.receiptForm.get('status')?.setValue(data.status.toString());
        this.receiptForm.setControl('productDetails', new FormArray([]));
        data.productDetails.forEach((productDetail: any) => {
          this.receiptDetails.push(
            new FormGroup({
              id: new FormControl(productDetail.id),
              color: new FormControl(productDetail.color, [Validators.required]),
              quantity: new FormControl(productDetail.quantity)
            })
          );
        });
      },
      error: (err: any) => {
        this.toastr.error(err.error, "Thất bại");
      }
    });
  }

  createProduct() {
    this.receiptService.create(this.receiptForm.value).subscribe({
      next: () => {
        this.toastr.success("Thêm hóa đơn thành công");
        this.router.navigateByUrl("/admin/product");
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }

  updateStatus() {
    this.receiptService.updateStatus(this.activatedRoute.snapshot.params["id"], this.receiptForm.get('status')?.value).subscribe({
      next: () => {
        this.toastr.success("Cập nhật trạng thái thành công");
        this.router.navigateByUrl("/admin/receipt");
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
