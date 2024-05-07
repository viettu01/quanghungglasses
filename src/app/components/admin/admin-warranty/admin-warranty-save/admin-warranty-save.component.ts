import {Component, OnInit} from '@angular/core';
import {CustomerDto} from "../../../../dto/customer.dto";
import {ProductDto} from "../../../../dto/product.dto";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../../../../service/customer.service";
import {OrderService} from "../../../../service/order.service";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {OrderDto} from "../../../../dto/order.dto";
import {OrderDetailsDto} from "../../../../dto/order-details.dto";
import {WarrantyService} from "../../../../service/warranty.service";

@Component({
  selector: 'app-admin-warranty-save',
  templateUrl: './admin-warranty-save.component.html',
  styleUrls: ['./admin-warranty-save.component.css']
})
export class AdminWarrantySaveComponent implements OnInit {
  customers: CustomerDto[] = [];
  products: ProductDto[] = [];
  orders: OrderDto[] = [];
  orderDetails: OrderDetailsDto[] = [];
  warrantyTypes: any[] = [
    {id: 0, name: 'Sửa chữa', selected: true},
    // {id: 1, name: 'Đổi sản phẩm (Không lỗi)'},
    // {id: 2, name: 'Đổi sản phẩm (Lỗi)'}
  ];
  price: number = 0;
  totalMoney: number = 0;
  customerId: number = 0;
  isUpdate: boolean = false;
  status: boolean = false;

  constructor(private title: Title, private toastr: ToastrService, private router: Router,
              private activatedRoute: ActivatedRoute, private customerService: CustomerService,
              private orderService: OrderService, private warrantyService: WarrantyService) {
  }

  warrantyForm: FormGroup = new FormGroup({
    fullname: new FormControl(''),
    customerPhone: new FormControl(null, [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern("^0[0-9]{9}$")
    ]),
    status: new FormControl('false', Validators.required),
    warrantyDetails: new FormArray([], Validators.required),

    orders: new FormControl(null),
    orderDetails: new FormControl(null),
  });

  ngOnInit(): void {
    this.title.setTitle('Thêm phiếu bảo hành');
    this.getInfo();
    this.findAllCustomers();
    if (this.activatedRoute.snapshot.params["id"] != undefined) {
      this.findById(this.activatedRoute.snapshot.params["id"]);
      this.title.setTitle('Cập nhật phiếu bảo hành');
      this.isUpdate = true;
    }
  }

  get warrantyDetails() {
    return this.warrantyForm.get('warrantyDetails') as FormArray;
  }

  addWarrantyDetails() {
    // neu san pham da ton tai thi kiem tra so luong trong warrantyDetails neu so luong < so luong trong order thi cho them vao warrantyDetails neu khong thi thong bao
    if (this.warrantyForm.get('orderDetails')?.value.productTimeWarranty == 0) {
      this.toastr.error('Sản phẩm không hỗ trợ bảo hành');
      return;
    }
    // so sanh thoi gian bao hanh với thoi gian mua hang voi thoi gian bao hanh tinh theo ngay VD: 03/05/2024 + 30 ngay = 02/06/2024
    let order = this.warrantyForm.get('orders')?.value as OrderDto;
    let orderDetails = this.warrantyForm.get('orderDetails')?.value as OrderDetailsDto;
    // chuyen thoi gian bao hanh sang mili giay
    let warrantyTime = orderDetails.productTimeWarranty * 24 * 60 * 60 * 1000;
    // chuyen thoi gian mua hang sang mili giay
    let orderTime = new Date(order.createdDate).getTime();
    // tinh thoi gian het han bao hanh
    let warrantyExpired = orderTime + warrantyTime;
    // console.log('warrantyExpired: ', warrantyExpired);
    // tinh thoi gian hien tai
    let currentTime = new Date().getTime();
    // console.log('currentTime: ', currentTime);
    if (currentTime > warrantyExpired) {
      this.toastr.error('Sản phẩm đã hết thời gian bảo hành');
      return;
    }

    for (let i = 0; i < this.warrantyDetails.length; i++) {
      if (this.warrantyDetails.at(i).get('orderId')?.value === this.warrantyForm.get('orders')?.value.id &&
        this.warrantyDetails.at(i).get('productDetailsId')?.value === this.warrantyForm.get('orderDetails')?.value.productDetailsId) {
        let totalQuantity = 0;
        this.warrantyDetails.value.forEach((value: any) => {
          if (value.productDetailsId === this.warrantyForm.get('orderDetails')?.value.productDetailsId) {
            totalQuantity += value.quantity;
          }
        });
        if (totalQuantity >= this.warrantyForm.get('orderDetails')?.value.quantity) {
          this.toastr.error('Sản phẩm đã được chọn hết');
          this.warrantyForm.get('orders')?.setValue(null);
          this.warrantyForm.get('orderDetails')?.setValue(null);
          return;
        }
      }
    }
    this.warrantyDetails.push(
      new FormGroup({
        id: new FormControl(null),
        orderId: new FormControl(this.warrantyForm.get('orders')?.value.id),
        productDetailsId: new FormControl(this.warrantyForm.get('orderDetails')?.value.productDetailsId),
        productName: new FormControl(this.warrantyForm.get('orderDetails')?.value.productName),
        productColor: new FormControl(this.warrantyForm.get('orderDetails')?.value.productColor),
        quantityInOrder: new FormControl(this.warrantyForm.get('orderDetails')?.value.quantity),
        quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
        warrantyType: new FormControl(null, [Validators.required]),
        cost: new FormControl(0, [Validators.required, Validators.min(0)]),
        note: new FormControl("", [Validators.maxLength(255)]),
      })
    );

    // console.log(this.warrantyDetails.value);

    this.warrantyForm.get('orders')?.setValue(null);
    this.warrantyForm.get('orderDetails')?.setValue(null);
    this.orderDetails = [];
    this.getTotalMoney();
  }

  findAllCustomers() {
    this.customerService.findAll("", "", Math.pow(2, 31) - 1, 1, "", "").subscribe({
      next: (response: any) => {
        this.customers = response.content;
      }
    });
  }

  getInfo() {
    this.warrantyForm.get('orders')?.setValue(null);
    this.customers.filter(customer => customer.phone == this.warrantyForm.get('customerPhone')?.value).forEach(customer => {
      this.warrantyForm.get('fullname')?.setValue(customer.fullname);
      this.customerId = customer.id;
      this.findAllOrderByCustomer();
      return;
    });
  }

  findAllOrderByCustomer() {
    this.orderService.findAll("", Math.pow(2, 31) - 1, 1, "", "").subscribe({
      next: (data: any) => {
        this.orders = data.content;
        this.orders = this.orders.filter(order => order.customerId == this.customerId && order.orderStatus == 5);
      }
    });
  }

  changeOrder() {
    this.warrantyForm.get('orderDetails')?.setValue(null);
    let order = this.warrantyForm.get('orders')?.value as OrderDto;
    if (order === null) {
      this.orderDetails = [];
      return;
    }
    this.orderDetails = order.orderDetails;
  }

  quantityChange(index: number) {
    if (this.warrantyDetails.at(index).get('quantity')?.value < 1) {
      this.warrantyDetails.at(index).get('quantity')?.setValue(1);
    } else if (this.warrantyDetails.at(index).get('quantity')?.value > this.warrantyDetails.at(index).get('quantityInOrder')?.value) {
      this.warrantyDetails.at(index).get('quantity')?.setValue(this.warrantyDetails.at(index).get('quantityInOrder')?.value);
    }

    const totalPrice = this.warrantyDetails.at(index).get('price')?.value * this.warrantyDetails.at(index).get('quantity')?.value;
    this.warrantyDetails.at(index).get('totalOneProduct')?.setValue(totalPrice);
    this.getTotalMoney();
  }

  changeCost(index: number) {
    this.getTotalMoney();
  }

  removeWarrantyDetails(index: number) {
    this.warrantyDetails.removeAt(index);
    this.getTotalMoney();
  }

  getTotalMoney() {
    this.totalMoney = 0;
    this.warrantyDetails.value.forEach((item: any) => {
      this.totalMoney += Number(item.cost) * Number(item.quantity);
    });
  }

  onSubmit() {
    if (this.warrantyForm.invalid) {
      return;
    }
    if (this.isUpdate)
      this.update(this.activatedRoute.snapshot.params["id"]);
    else
      this.create();
  }

  create() {
    // let warranty = this.warrantyForm.value;
    // warranty.paymentStatus = 0;
    // warranty.orderStatus = 0; // 0: Chờ xác nhận, 1: Đã xác nhận, 2: Đang giao, 3: Đã giao, 4: Đã hủy
    // warranty.orderDetails = this.warrantyDetails.value;
    // if (warranty.paymentMethod == 0) {
    //   warranty.orderStatus = 5;
    // }
    this.warrantyService.create(this.warrantyForm.value).subscribe({
      next: () => {
        this.toastr.success('Thêm phiếu bảo hành thành công');
        this.router.navigateByUrl('/admin/warranty');
      },
      error: (error: any) => {
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }

  findById(id: number) {
    this.warrantyService.findById(id).subscribe({
      next: (response: any) => {
        this.warrantyForm.patchValue(response);
        this.warrantyForm.get('customerPhone')?.setValue(response.customerPhone);
        this.warrantyForm.get('fullname')?.setValue(response.customerName);
        this.warrantyForm.get('status')?.setValue(response.status.toString());
        this.status = response.status;
        this.warrantyDetails.clear();
        response.warrantyDetails.forEach((item: any) => {
          this.warrantyDetails.push(
            new FormGroup({
              id: new FormControl(item.id),
              orderId: new FormControl(item.orderId),
              productDetailsId: new FormControl(item.productDetailsId),
              productName: new FormControl(item.productName),
              productColor: new FormControl(item.productColor),
              quantity: new FormControl(item.quantity),
              warrantyType: new FormControl(item.warrantyType),
              cost: new FormControl(item.cost),
              note: new FormControl(item.note),
            })
          );
        });
        this.getTotalMoney();
      }
    });
  }

  update(id: number) {
    this.warrantyService.update(id, this.warrantyForm.get('status')?.value).subscribe({
      next: () => {
        this.toastr.success('Cập nhật phiếu bảo hành thành công');
        this.router.navigateByUrl('/admin/warranty');
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
