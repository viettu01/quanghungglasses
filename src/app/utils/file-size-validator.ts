import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function FileSizeValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Nếu không có file, không có lỗi
    }

    const file = control.value as File;

    // Kiểm tra kích thước file
    if (file.size > maxSize) {
      return {'maxFileSizeExceeded': true};
    }

    return null; // Không có lỗi
  };
}
