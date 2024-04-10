import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../service/cart.service";
import {TokenService} from "../../../service/token.service";
import {CartDto} from "../../../dto/cart.dto";
import {Environment} from "../../../environment/environment";
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import {ProductService} from "../../../service/product.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartsItems: CartDto[] = [];
  baseUrl = Environment.apiBaseUrl + '/images/';
  selectedItems: CartDto[] = [];
  totalMoneySelectedItems: number = 0;
  masterSelected = false;

  constructor(private tokenService: TokenService, private cartService: CartService, private toastr: ToastrService,
              private title: Title, private productService: ProductService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Giỏ hàng');
    this.findAllCartItems();
    sessionStorage.removeItem('selectedItems');
  }

  checkUncheckAll(event: any) {
    this.masterSelected = event.target.checked
    this.cartsItems.forEach((c) => {
      if (c.quantityInStock > 0)
        c.isSelected = event.target.checked
    })
    this.selectedItems = this.cartsItems.filter((item) => item.isSelected);
    this.totalMoneySelectedItem();
  }

  isAllSelected(event: any, index: number) {
    this.cartsItems[index].isSelected = event.target.checked
    this.masterSelected = this.cartsItems.every((item) => item.isSelected);
    this.selectedItems = this.cartsItems.filter((item) => item.isSelected);
    this.totalMoneySelectedItem();
  }

  totalMoneySelectedItem() {
    // tinh tong tien cua cac san pham duoc chon bang so luong * gia
    this.totalMoneySelectedItems = this.selectedItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  }

  findAllCartItems() {
    if (this.tokenService.isLogin()) {
      this.cartService.getListItemCartOnServer().subscribe({
        next: (data: any) => {
          this.cartsItems = data.cartDetails;
          this.cartsItems.forEach((item: CartDto) => {
            if (item.quantity >= item.quantityInStock) {
              item.btnPlusDisabled = true;
            }
          });
          // sap xep lai theo san pham bi het se duoc hien thi cuoi cung
          this.cartsItems.sort((a, b) => b.quantityInStock - a.quantityInStock);
        }
      });
    } else {
      this.cartService.getListItemCartOnLocalStorage().forEach((item: CartDto) => {
        this.productService.findProductDetailsById(item.productDetailsId).subscribe({
          next: (data: any) => {
            item.productDetailsThumbnails = data.thumbnails;
            item.productName = data.name;
            item.productSlug = data.slug;
            item.productColor = data.color;
            item.productPrice = data.priceDiscount;
            item.quantityInStock = data.quantity;
            // debugger
            if (item.quantity >= item.quantityInStock) {
              item.btnPlusDisabled = true;
            }
            this.cartsItems.push(item);
          }
        })
      });
    }
  }

  plusQuantity(index: number, cartId: number) {
    if (this.tokenService.isLogin()) {
      this.cartsItems[index].quantity++;
      if (this.cartsItems[index].quantity + 1 >= this.cartsItems[index].quantityInStock) {
        this.cartsItems[index].btnPlusDisabled = true;
        // return;
      }
      this.cartService.plusQuantityOnServer(cartId);
    } else {
      if (this.cartsItems[index].quantity + 1 >= this.cartsItems[index].quantityInStock) {
        this.cartsItems[index].btnPlusDisabled = true;
      }
      this.cartService.plusQuantityOnLocalStorage(cartId);
    }

    this.totalMoneySelectedItem();
  }

  minusQuantity(index: number, cartId: number) {
    if (this.cartsItems[index].quantity > 1) {
      if (this.tokenService.isLogin()) {
        this.cartsItems[index].quantity--;
        if (this.cartsItems[index].quantity - 1 < this.cartsItems[index].quantityInStock) {
          this.cartsItems[index].btnPlusDisabled = false;
        }
        if (this.cartsItems[index].quantity >= 1) {
          this.cartService.minusQuantityOnServer(cartId);
        }
      } else {
        if (this.cartsItems[index].quantity - 1 < this.cartsItems[index].quantityInStock) {
          this.cartsItems[index].btnPlusDisabled = false;
        }
        this.cartService.minusQuantityOnLocalStorage(cartId);
      }
      this.totalMoneySelectedItem();
    }
  }

  updateProductQuantity(event: any, cartItem: CartDto) {
    if (event.target.value > cartItem.quantityInStock) {
      cartItem.quantity = cartItem.quantityInStock;
    } else if (event.target.value < 1) {
      cartItem.quantity = 1;
    } else {
      cartItem.quantity = event.target.value;
      cartItem.btnPlusDisabled = false;
    }
    if (cartItem.quantity >= cartItem.quantityInStock) {
      cartItem.btnPlusDisabled = true;
    }
    if (this.tokenService.isLogin()) {
      this.cartService.updateProductQuantityOnServer(cartItem);
    } else {
      this.cartService.updateProductQuantityOnLocalStorage(cartItem);
    }
  }

  removeCartItem(cartId: number) {
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
        if (this.tokenService.isLogin()) {
          this.cartService.deleteCartItemOnServer(cartId).subscribe({
            next: () => {
              this.toastr.success('Xóa sản phẩm thành công', 'Thông báo');
              this.findAllCartItems();
              // this.selectedItems = this.cartsItems.filter((item) => item.isSelected);
              // this.totalMoneySelectedItem();
            }
          });
        } else {
          this.cartService.deleteCartItemOnLocalStorage(cartId);
          // cap nhat lai danh sach san pham trong gio hang
          this.cartsItems = this.cartService.getListItemCartOnLocalStorage();
          this.toastr.success('Xóa sản phẩm thành công', 'Thông báo');
          // this.selectedItems = this.cartsItems.filter((item) => item.isSelected);
          // this.totalMoneySelectedItem();
        }
      }
    })
  }

  checkout() {
    // Luu danh sach san pham duoc chon vao sessionStorage de su dung o trang thanh toan co han la 60 giay
    sessionStorage.setItem('selectedItems', JSON.stringify(this.selectedItems));
    // luu cart id vao sessionStorage de su dung o trang thanh toan
    // sessionStorage.setItem('cartId', JSON.stringify(this.selectedItems.map(item => item.id)));

    // chuyen huong sang trang thanh toan
    window.location.href = '/thanh-toan';
  }
}
