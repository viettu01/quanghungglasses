import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function greaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Kiểm tra xem giá trị là số và lớn hơn 0 không
    if (isNaN(value) || value <= 0) {
      return { 'greaterThanZero': true };
    }

    return null; // Không có lỗi
  };
}
