import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {CategoryService} from "../../../service/category.service";
import {CategoryProductDto} from "../../../dto/category-product.dto";

import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from "swiper/element/swiper-element";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  categoryAndProducts: CategoryProductDto[] = [];

  index = 0;

  // Swiper
  swiperThumbsConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      450: {slidesPerView: 2, spaceBetween: 16},
      768: {slidesPerView: 3, spaceBetween: 20},
      1200: {slidesPerView: 4, spaceBetween: 16}
    },
    freeMode: true,
    watchSlidesProgress: true,
  }

  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }
  // End Swiper

  constructor(private title: Title, private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Kính mắt Quang Hưng');
    this.findAllCategoryAndProduct();
  }

  findAllCategoryAndProduct() {
    this.categoryService.findAllCategoryAndProduct().subscribe({
      next: (data: any) => {
        this.categoryAndProducts = data;
        console.log(this.categoryAndProducts);
      }
    });
  }
}
