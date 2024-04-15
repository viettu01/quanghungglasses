import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {Utils} from "./utils";

export function BirthdayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let datePipe = new DatePipe('en-US');
    let age = Utils.calculateAge(datePipe.transform(control.value, 'yyyy-MM-dd'));

    if (age < 18)
      return {"birthday": true};

    return null;
  }
}
