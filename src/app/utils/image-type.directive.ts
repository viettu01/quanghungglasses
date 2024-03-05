import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appImageType]'
})
export class ImageTypeDirective {
  @Input() allowedExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'];

  constructor(private el: ElementRef) {
  }

  @HostListener('change') onChange() {
    const files = this.el.nativeElement.files;
    if (files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!this.allowedExtensions.includes(fileExtension)) {
        // File không phải là ảnh, có thể thực hiện xử lý tương ứng ở đây
        this.el.nativeElement.value = '';
      }
    }
  }
}
