import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../../service/product.service";
import {ProductDto} from "../../../../dto/product.dto";
import {ActivatedRoute, Router} from "@angular/router";
import {Environment} from "../../../../environment/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from "swiper/element/swiper-element";
import {CartService} from "../../../../service/cart.service";
import {CartDto} from "../../../../dto/cart.dto";
import {TokenService} from "../../../../service/token.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-client-product-details',
  templateUrl: './client-product-details.component.html',
  styleUrls: ['./client-product-details.component.css']
})
export class ClientProductDetailsComponent implements OnInit {

  product: ProductDto = ProductDto.createEmpty();
  productImageSelected: string = '';
  productDetailsId: number = 0;
  baseUrl = Environment.apiBaseUrl + '/images/';
  @ViewChild('swiperThumbs') swiperThumbs!: ElementRef<SwiperContainer>;
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  swiperThumbsConfig: SwiperOptions = {
    slidesPerView: 6, // hien thi 6 slide
    spaceBetween: 16, // khoang cach giua cac slide
  }
  idCart: number = 0;
  quantity: number = 1;
  quantityMax: number = 0;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private router: Router,
              private sanitizer: DomSanitizer, private tokenService: TokenService, private cartService: CartService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.findProductBySlug(this.activatedRoute.snapshot.params['slug']);
  }

  findProductBySlug(slug: string) {
    this.productService.findBySlug(slug).subscribe({
      next: (product: any) => {
        this.product = product;
        console.log(this.product);
        this.productImageSelected = this.product.images[0];
        this.productDetailsId = this.product.productDetails[0].id;
        this.quantityMax = this.product.productDetails[0].quantity;
      }
    });
  }

  getHtmlProductDescription() {
    return this.sanitizer.bypassSecurityTrustHtml(this.product.description);
  }

  changeProductDetailsId(id: number) {
    this.productDetailsId = id;
    this.quantityMax = this.product.productDetails.find(item => item.id === id)!.quantity;
    this.quantity = 1;
    console.log(this.quantityMax);
  }

  changeImage(image: string) {
    this.productImageSelected = image;
  }

  plusQuantity() {
    if (this.quantity + 1 <= this.quantityMax) {
      this.quantity++;
    }
    return;
    // this.quantity++;
  }

  minusQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  quantityChange(event: any) {
    if (event.target.value > this.quantityMax) {
      this.quantity = this.quantityMax;
    } else if (event.target.value < 1) {
      this.quantity = 1;
    } else {
      this.quantity = event.target.value;
    }
  }

  addToCart() {
    this.idCart++;
    let cartDto = CartDto.createEmpty();
    cartDto.productDetailsId = this.productDetailsId;
    cartDto.quantity = this.quantity;
    cartDto.isSelected = false;

    if (this.tokenService.isLogin()) {
      cartDto.id = 0;
      this.cartService.addToCartServer(cartDto);
    } else {
      this.toastr.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      this.router.navigate(['/login']);
      return;

      // cartDto.id = this.idCart;
      // let cartLocal: CartDto[] = localStorage.getItem('carts') ? JSON.parse(localStorage.getItem('carts')!) : [];
      // // debugger;
      // if (cartLocal.length > 0) {
      //   cartLocal.forEach((item: CartDto) => {
      //     // Kiem tra neu so luong san pham trong gio lon hon hoac bang so luong san pham trong kho thi khong cho them vao gio hang
      //     if (item.productDetailsId === cartDto.productDetailsId) {
      //       if (item.quantity >= this.quantityMax) {
      //         this.toastr.error('Số lượng sản phẩm trong giỏ hàng đã đạt giới hạn');
      //         return;
      //       } else {
      //         this.cartService.addToCartLocalStorage(cartDto);
      //       }
      //     } else {
      //       this.cartService.addToCartLocalStorage(cartDto);
      //     }
      //   });
      // } else {
      //   this.cartService.addToCartLocalStorage(cartDto);
      // }
    }
  }
}
