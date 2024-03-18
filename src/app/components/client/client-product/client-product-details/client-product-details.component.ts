import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductService} from "../../../../service/product.service";
import {ProductDto} from "../../../../dto/product.dto";
import {ActivatedRoute} from "@angular/router";
import {Environment} from "../../../../environment/environment";
import {DomSanitizer} from "@angular/platform-browser";
import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from "swiper/element/swiper-element";
import {CartService} from "../../../../service/cart.service";

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
    slidesPerView: 6, // hien thi 5 slide
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
  index = 0;

  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.findProductBySlug(this.activatedRoute.snapshot.params['slug']);
  }

  findProductBySlug(slug: string) {
    this.productService.findBySlug(slug).subscribe({
      next: (product: any) => {
        this.product = product;
        this.productImageSelected = this.product.images[0];
        this.productDetailsId = this.product.productDetails[0].id;
      }
    });
  }

  getHtmlProductDescription() {
    return this.sanitizer.bypassSecurityTrustHtml(this.product.description);
  }

  changeProductDetailsId(id: number) {
    this.productDetailsId = id;
  }

  changeImage(image: string) {
    this.productImageSelected = image;
  }

  addToCart(id: number, quantity: number) {
    this.cartService.addToCart(id, quantity);
  }
}
