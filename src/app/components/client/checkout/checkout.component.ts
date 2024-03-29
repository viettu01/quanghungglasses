import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {CartDto} from "../../../dto/cart.dto";
import {Environment} from "../../../environment/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {OrderService} from "../../../service/order.service";
import {ToastrService} from 'ngx-toastr';
import {CartService} from "../../../service/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  baseUrl = Environment.apiBaseUrl + '/images/';
  cartsItems: CartDto[] = [];
  totalMoney: number = 0;
  selectedEyeglassPrescriptionUrl: string = '';

  constructor(private title: Title, private toastr: ToastrService,
              private authService: AuthService, private orderService: OrderService, private cartService: CartService) {
  }

  orderForm: FormGroup = new FormGroup({
    fullname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
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
  }

  getTotalMoney() {
    // tinh tong tien cua cac san pham duoc chon bang so luong * gia
    this.totalMoney = this.cartsItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
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
    if (this.orderForm.get('paymentMethod')?.value === '0') {
      orderDto.paymentStatus = 0;
    } else {
      orderDto.paymentStatus = 1;
    }
    orderDto.orderStatus = 0; // 0: Chờ xác nhận, 1: Đã xác nhận, 2: Đang giao, 3: Đã giao, 4: Đã hủy
    orderDto.orderDetails = this.cartsItems.map(item => {
      return {
        productDetailsId: item.productDetailsId,
        quantity: item.quantity,
        price: item.productPrice
      };
    });
    this.orderService.create(orderDto).subscribe({
      next: (response: any) => {
        this.toastr.success('Đặt hàng thành công');
        sessionStorage.removeItem('selectedItems');
        this.cartsItems.forEach(item => {
          this.cartService.deleteCartItemOnServer(item.id).subscribe({
            next: () => {}
          });
        });
        window.location.href = '/don-hang/' + response.id;
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
