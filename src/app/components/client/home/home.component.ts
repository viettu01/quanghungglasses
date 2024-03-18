import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {CategoryService} from "../../../service/category.service";
import {CategoryProductDto} from "../../../dto/category-product.dto";

import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from "swiper/element/swiper-element";
import {Environment} from "../../../environment/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  baseUrl = Environment.apiBaseUrl + '/images';
  categoryAndProducts: CategoryProductDto[] = [];

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
      }
    });
  }
}
