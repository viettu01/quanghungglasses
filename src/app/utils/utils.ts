import {AbstractControl, ValidationErrors} from "@angular/forms";

export class Utils {
  static getVisiblePages(currentPage: number, totalPages: number, visibleCount: number): number[] {
    // start = Giá trị nhỏ nhất của trang hiển thị
    let start = Math.max(1, Math.min(currentPage - Math.floor(visibleCount / 2), totalPages - visibleCount + 1));
    // end = Giá trị lớn nhất của trang hiển thị
    let end = Math.min(totalPages, start + visibleCount - 1);
    return Array.from({length: end - start + 1}, (_, index) => start + index);
  }

  static noSpaceAllowed(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return {noSpaceAllowed: true}
    }
    return null;
  }

  static removeLeadingWhitespace(input: string): string {
    return input.trimStart();
  }
}
