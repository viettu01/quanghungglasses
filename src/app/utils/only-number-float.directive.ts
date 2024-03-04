import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appOnlyNumberFloatDirective]'
})
export class OnlyNumberFloatDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInput() {
    const inputElement = this.el.nativeElement;
    let value = inputElement.value;

    // Xóa bất kỳ ký tự không phải số thực
    value = value.replace(/[^0-9.]/g, '');

    // Chỉ cho phép một dấu chấm thập phân
    const decimalCount = value.split('.').length - 1;
    if (decimalCount > 1) {
      value = value.substring(0, value.lastIndexOf('.'));
    }

    // Cập nhật giá trị trong input
    this.renderer.setProperty(inputElement, 'value', value);
  }
}
