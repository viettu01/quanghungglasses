import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {CartDto} from "../../../../dto/cart.dto";
import {Environment} from "../../../../environment/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../service/auth.service";
import {OrderService} from "../../../../service/order.service";
import {ToastrService} from 'ngx-toastr';
import {CartService} from "../../../../service/cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  baseUrl = Environment.apiBaseUrl + '/images/';
  cartsItems: CartDto[] = [];
  totalMoney: number = 0;
  totalMoneyOriginal: number = 0;
  totalMoneyDiscount: number = 0;
  totalQuantity: number = 0;
  selectedEyeglassPrescriptionUrl: string = '';
  isDisplayNone: boolean = false;

  constructor(private title: Title, private toastr: ToastrService, private router: Router,
              private authService: AuthService, private orderService: OrderService, private cartService: CartService) {
  }

  orderForm: FormGroup = new FormGroup({
    fullname: new FormControl('', [
      Validators.required,
      Validators.maxLength(30)
    ]),
    phone: new FormControl('', [
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
    paymentMethod: new FormControl('0', Validators.required)
  });

  ngOnInit(): void {
    this.title.setTitle('Thanh toán');
    this.getProductFromSession();
    this.getTotalMoney();
    this.getProfile();
  }

  getProductFromSession() {
    // lay danh sach san pham trong session
    this.cartsItems = JSON.parse(sessionStorage.getItem('selectedItems') || '[]');
    console.log(this.cartsItems)
  }

  getTotalMoney() {
    this.totalQuantity = this.cartsItems.reduce((sum, item) => sum + item.quantity, 0);
    // tinh tong tien cua cac san pham duoc chon bang so luong * gia
    this.totalMoney = this.cartsItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
    this.totalMoneyOriginal = this.cartsItems.reduce((sum, item) => sum + (item.productPriceOriginal * item.quantity), 0);
    this.totalMoneyDiscount = this.totalMoneyOriginal - this.totalMoney;
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

  getProfile() {
    this.authService.getProfile().subscribe({
      next: (response: any) => {
        this.orderForm.get('fullname')?.setValue(response.fullname);
        this.orderForm.get('phone')?.setValue(response.phone);
        this.orderForm.get('email')?.setValue(response.account.email);
        this.orderForm.get('address')?.setValue(response.address);
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
    orderDto.orderDetails = this.cartsItems.map(item => {
      return {
        productDetailsId: item.productDetailsId,
        quantity: item.quantity,
        price: item.productPrice
      };
    });
    if (orderDto.orderDetails.length === 0) {
      this.toastr.error('Vui lòng chọn sản phẩm');
      return;
    }
    this.isDisplayNone = true;
    this.orderService.createClient(orderDto).subscribe({
      next: (response: any) => {
        this.isDisplayNone = false;
        this.toastr.success('Đặt hàng thành công');
        sessionStorage.removeItem('selectedItems');
        this.cartsItems.forEach(item => {
          this.cartService.deleteCartItemOnServer(item.id).subscribe({
            next: () => {
              this.cartService.getCartItemsServer();
            }
          });
        });
        if (orderDto.paymentMethod === '0') {
          this.router.navigateByUrl('/don-hang/' + response.id);
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
        this.isDisplayNone = false;
        if (error.status === 400)
          this.toastr.error(error.error);
        else
          this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
      }
    });
  }
}
