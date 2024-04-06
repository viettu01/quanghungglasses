import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Environment} from "../../../../environment/environment";
import {OrderService} from "../../../../service/order.service";
import {CustomerService} from "../../../../service/customer.service";
import {CustomerDto} from "../../../../dto/customer.dto";
import {ProductDto} from "../../../../dto/product.dto";
import {ProductDetailsDto} from "../../../../dto/product-details.dto";
import {greaterThanZeroValidator} from "../../../../utils/greater-than-zero-validator";
import {ProductService} from "../../../../service/product.service";

@Component({
  selector: 'app-admin-order-save',
  templateUrl: './admin-order-save.component.html',
  styleUrls: ['./admin-order-save.component.css']
})
export class AdminOrderSaveComponent implements OnInit {
  baseUrl = Environment.apiBaseUrl + '/images/';
  customers: CustomerDto[] = [];
  products: ProductDto[] = [];
  productDetails: ProductDetailsDto[] = [];
  price: number = 0;
  totalMoney: number = 0;
  selectedEyeglassPrescriptionUrl: string = '';

  constructor(private title: Title, private toastr: ToastrService, private router: Router,
              private customerService: CustomerService, private orderService: OrderService,
              private productService: ProductService) {
  }

  orderForm: FormGroup = new FormGroup({
    fullname: new FormControl('', [
      Validators.required,
      Validators.maxLength(30)
    ]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern("^0[0-9]{9}$")
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(200)
    ]),
    note: new FormControl(''),
    eyeglassPrescriptionImage: new FormControl(null),
    paymentMethod: new FormControl('0', Validators.required),
    orderDetails: new FormArray([], Validators.required),

    product: new FormControl(null),
    productDetails: new FormControl(null),
  });

  ngOnInit(): void {
    this.title.setTitle('Thêm hóa đơn bán hàng');
    this.getInfo();
    this.findAllCustomers()
    this.findAllProduct();
  }

  get orderDetails() {
    return this.orderForm.get('orderDetails') as FormArray;
  }

  changeProduct() {
    this.orderForm.get('productDetails')?.setValue(null);
    let product = this.orderForm.get('product')?.value as ProductDto;
    if (product === null) {
      this.productDetails = [];
      return;
    }
    this.productDetails = product.productDetails;
    this.price = product.priceDiscount === null ? product.price : product.priceDiscount;
  }

  addOrderDetails() {
    this.orderForm.get('productDetailsIdSearch')?.setValue(null);
    for (let i = 0; i < this.orderDetails.length; i++) {
      if (this.orderDetails.at(i).get('productDetailsId')?.value === this.orderForm.get('productDetails')?.value.id) {
        this.orderDetails.at(i).get('quantity')?.setValue(this.orderDetails.at(i).get('quantity')?.value + 1);
        const totalPrice = this.price * this.orderDetails.at(i).get('quantity')?.value;
        this.orderDetails.at(i).get('totalOneProduct')?.setValue(totalPrice);
        this.orderForm.get('product')?.setValue(null);
        this.orderForm.get('productDetails')?.setValue(null);
        this.getTotalMoney();
        return;
      }
    }
    this.orderDetails.push(
      new FormGroup({
        id: new FormControl(null),
        productDetailsId: new FormControl(this.orderForm.get('productDetails')?.value.id),
        productName: new FormControl(this.orderForm.get('product')?.value.name),
        color: new FormControl(this.orderForm.get('productDetails')?.value.color),
        quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
        price: new FormControl(this.price, [Validators.required, greaterThanZeroValidator()]),
        totalOneProduct: new FormControl(this.price),
      })
    );

    this.orderForm.get('product')?.setValue(null);
    this.orderForm.get('productDetails')?.setValue(null);
    this.getTotalMoney();
  }

  quantityChange(index: number) {
    const totalPrice = this.orderDetails.at(index).get('price')?.value * this.orderDetails.at(index).get('quantity')?.value;
    this.orderDetails.at(index).get('totalOneProduct')?.setValue(totalPrice);
    this.getTotalMoney();
  }

  removeOrderDetails(index: number) {
    this.orderDetails.removeAt(index);
    this.getTotalMoney();
  }

  getTotalMoney() {
    this.totalMoney = 0;
    // tinh tong tien cua cac san pham duoc chon bang so luong * gia
    this.orderDetails.value.forEach((item: any) => {
      this.totalMoney += item.totalOneProduct;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.orderForm.get('eyeglassPrescriptionImage')?.setValue(file);
    if (file) {
      if ((file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/webp') && file.size <= 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedEyeglassPrescriptionUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedEyeglassPrescriptionUrl = '';
      }
    }
  }

  removeEyeglassPrescription() {
    this.orderForm.get('eyeglassPrescriptionImage')?.setValue(null);
    this.selectedEyeglassPrescriptionUrl = '';
    // reset input file
    const fileInput = document.getElementById('eyeglassPrescriptionImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  findAllCustomers() {
    this.customerService.findAll("", "", Math.pow(2, 31) - 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.customers = response.content;
      }
    });
  }

  getInfo() {
    this.orderForm.get('fullname')?.setValue("");
    this.orderForm.get('address')?.setValue("");
    this.customers.filter(customer => customer.phone == this.orderForm.get('phone')?.value).forEach(customer => {
      this.orderForm.get('fullname')?.setValue(customer.fullname);
      this.orderForm.get('address')?.setValue(customer.address);
      return;
    });

  }

  findAllProduct() {
    this.productService.findAllByName("", Math.pow(2, 31) - 1, 1, "", "").subscribe({
      next: (data: any) => {
        this.products = data.content;
      }
    });
  }

  onSubmit() {
    if (this.orderForm.invalid) {
      return;
    }
    this.create();
  }

  create() {
    let orderDto = this.orderForm.value;
    orderDto.paymentStatus = 0;
    orderDto.orderStatus = 0; // 0: Chờ xác nhận, 1: Đã xác nhận, 2: Đang giao, 3: Đã giao, 4: Đã hủy
    orderDto.orderDetails = this.orderDetails.value;
    if (orderDto.paymentMethod == 0) {
      orderDto.orderStatus = 5;
    }
    this.orderService.create(orderDto).subscribe({
      next: (response: any) => {
        this.toastr.success('Thêm hóa đơn thành công');
        if (orderDto.paymentMethod === '0') {
          this.router.navigateByUrl('/admin/order/' + response.id);
        } else if (orderDto.paymentMethod === '1') {
          this.orderService.payment(this.totalMoney, response.id).subscribe({
            next: (data: any) => {
              window.location.href = data.redirectUrl;
            },
            error: () => {
              this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
            }
          });
        }
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
