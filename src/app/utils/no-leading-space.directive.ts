import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appNoLeadingSpace]'
})
export class NoLeadingSpaceDirective {
  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInput(event: any) {
    const inputValue = event.target.value;

    // Kiểm tra xem ký tự đầu tiên có phải là space không
    if (inputValue.startsWith(' ')) {
      // Nếu là space, làm ngăn chặn và xóa nó
      event.target.value = inputValue.trim();
    }
  }
}
