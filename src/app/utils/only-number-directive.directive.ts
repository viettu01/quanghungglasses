import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appOnlyNumberDirective]'
})
export class OnlyNumberDirectiveDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event']) onInput() {
    const inputElement = this.el.nativeElement;
    let value = inputElement.value;

    // Xóa bất kỳ ký tự không phải số
    value = value.replace(/[^0-9]/g, '');

    // Cập nhật giá trị trong input
    this.renderer.setProperty(inputElement, 'value', value);
  }
}
