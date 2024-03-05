import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function FileTypeValidator(allowedExtensions: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Nếu không có file, không có lỗi
    }

    const file = control.value as File;
    const fileName = file.name;

    // Kiểm tra xem file có phải là ảnh không
    const fileExtension = (fileName as string).split('.').pop()?.toLowerCase();

    // Check if fileExtension is an empty string (no extension)
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return { 'invalidFileType': true };
    }

    return null; // No error
  };
}
