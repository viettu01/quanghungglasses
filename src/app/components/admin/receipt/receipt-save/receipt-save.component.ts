import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../../../service/product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {SupplierService} from "../../../../service/supplier.service";
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

  isDisplayNone: boolean = false;
  btnSave: string = "";
  searchTemp: any = "";
  isUpdate: boolean = false;

  receiptForm: FormGroup = new FormGroup({
      id: new FormControl(null),
      productDetailsIdSearch: new FormControl(null),
      supplierId: new FormControl(null, [Validators.required]),
      status: new FormControl('false', [Validators.required]),
      receiptDetails: new FormArray([], Validators.required)
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
      this.isUpdate = true;
    }
    this.title.setTitle(this.titleString);
    this.findAllSupplier();
  }

  addReceiptDetails() {
    this.productService.findProductDetailsById(this.receiptForm.get('productDetailsIdSearch')?.value).subscribe({
      next: (data: any) => {
        this.receiptForm.get('productDetailsIdSearch')?.setValue(null);
        for (let i = 0; i < this.receiptDetails.length; i++) {
          if (this.receiptDetails.at(i).get('productDetailsId')?.value === data.id) {
            this.receiptDetails.at(i).get('quantity')?.setValue(this.receiptDetails.at(i).get('quantity')?.value + 1);
            const totalPrice = this.receiptDetails.at(i).get('price')?.value * this.receiptDetails.at(i).get('quantity')?.value;
            this.receiptDetails.at(i).get('totalOneProduct')?.setValue(totalPrice);
            return;
          }
        }
        this.receiptDetails.push(
          new FormGroup({
            id: new FormControl(null),
            productDetailsId: new FormControl(data.id),
            productName: new FormControl(data.name),
            color: new FormControl(data.color),
            quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
            price: new FormControl(1, [Validators.required, Validators.min(1)]),
            totalOneProduct: new FormControl(1),
          })
        );
      },
      error: (err: any) => {
        if (err.status == 400)
          this.toastr.error(err.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }

  quantityChange(index: number) {
    const totalPrice = this.receiptDetails.at(index).get('price')?.value * this.receiptDetails.at(index).get('quantity')?.value;
    this.receiptDetails.at(index).get('totalOneProduct')?.setValue(totalPrice);
  }

  priceChange(index: number) {
    const totalPrice = this.receiptDetails.at(index).get('price')?.value * this.receiptDetails.at(index).get('quantity')?.value;
    this.receiptDetails.at(index).get('totalOneProduct')?.setValue(totalPrice);
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
      this.createReceipt();
    } else {
      this.updateStatus();
    }
  }

  findAllSupplier() {
    this.supplierService.findAll().subscribe({
      next: (data: any) => {
        this.suppliers = data.content;
      }
    });
  }

  findReceiptById(id: number) {
    this.receiptService.findById(id).subscribe({
      next: (data: any) => {
        console.log(data)
        this.receiptForm.patchValue(data);
        this.receiptForm.get('status')?.setValue(data.status.toString());
        this.receiptForm.get('supplierId')?.disable();
        this.receiptDetails.clear();
        data.receiptDetails.forEach((receiptDetail: any) => {
          this.receiptDetails.push(
            new FormGroup({
              id: new FormControl(receiptDetail.id),
              productName: new FormControl(receiptDetail.productName),
              color: new FormControl(receiptDetail.productColor),
              quantity: new FormControl(receiptDetail.quantity),
              price: new FormControl(receiptDetail.price),
              totalOneProduct: new FormControl(1)
            })
          );
        });
        for (let i = 0; i < this.receiptDetails.length; i++) {
          const totalPrice = this.receiptDetails.at(i).get('price')?.value * this.receiptDetails.at(i).get('quantity')?.value;
          this.receiptDetails.at(i).get('totalOneProduct')?.setValue(totalPrice);
          this.receiptDetails.at(i).get('quantity')?.disable();
          this.receiptDetails.at(i).get('price')?.disable();
        }
      },
      error: (err: any) => {
        if (err.status == 400)
          this.toastr.error(err.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }

  createReceipt() {
    this.receiptService.create(this.receiptForm.value).subscribe({
      next: () => {
        this.toastr.success("Thêm hóa đơn thành công");
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
