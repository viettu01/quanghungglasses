import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {SwiperOptions} from "swiper/types";
import {SwiperContainer} from "swiper/element/swiper-element";

@Directive({
  selector: '[appSwiper]'
})
export class SwiperDirective {
  @Input() config?: SwiperOptions;

  constructor(private el: ElementRef<SwiperContainer>) {
  }

  ngAfterViewInit(): void {
    Object.assign(this.el.nativeElement, this.config);

    this.el.nativeElement.initialize();
  }
}
