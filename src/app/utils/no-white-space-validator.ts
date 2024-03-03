import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.trim() === '') {
      // Nếu giá trị chỉ chứa khoảng trắng, trả về lỗi
      return {'whitespace': true};
    }

    return null; // Không có lỗi
  };
}
