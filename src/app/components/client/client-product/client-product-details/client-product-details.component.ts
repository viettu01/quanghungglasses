import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../../service/product.service";
import {ProductDto} from "../../../../dto/product.dto";
import {ActivatedRoute} from "@angular/router";
import {Environment} from "../../../../environment/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from "swiper/element/swiper-element";
import {CartService} from "../../../../service/cart.service";
import {CartDto} from "../../../../dto/cart.dto";
import {TokenService} from "../../../../service/token.service";

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
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    centeredSlides: true,
    // khong cho phep cuon qua lai
    // allowTouchMove: false,
    // spaceBetween: 10,
    // navigation: true,
  };
  idCart: number = 0;
  quantity: number = 1;
  quantityMax: number = 0;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer,
              private tokenService: TokenService, private cartService: CartService) {
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
    console.log(this.quantityMax);
  }

  changeImage(image: string) {
    this.productImageSelected = image;
  }

  plusQuantity() {
    this.quantity++;
  }

  minusQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    this.idCart++;
    let cartDto = CartDto.createEmpty();
    cartDto.productDetailsId = this.productDetailsId;
    cartDto.quantity = this.quantity;
    cartDto.isSelected = false;

    if (!this.tokenService.isLogin()) {
      cartDto.id = this.idCart;
      this.cartService.addToCartLocalStorage(cartDto);
    } else {
      cartDto.id = 0;
      this.cartService.addToCartServer(cartDto);
    }
  }
}
