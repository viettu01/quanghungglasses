import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CustomerService} from "../../../../service/customer.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-customer-save',
  templateUrl: './customer-save.component.html',
  styleUrls: ['./customer-save.component.css']
})
export class CustomerSaveComponent implements OnInit {
  titleString: string = "";
  isDisplayNone: boolean = false;
  isShowDisplayAccount: boolean = false;
  isShowTileDisplayAccount: boolean = true;
  titleShowDisplayAccount: string = "Thêm tài khoản";
  btnSave: string = "";

  customerForm: FormGroup = new FormGroup({
      id: new FormControl(null),
      fullname: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern("^0[0-9]{9}$")
      ]),
      gender: new FormControl('Nam'),
      birthday: new FormControl(null, []),
      address: new FormControl('', [Validators.maxLength(200)]),
      account: new FormGroup(
        {
          id: new FormControl(null),
          email: new FormControl(''),
          password: new FormControl(''),
          status: new FormControl('true'),
        }
      )
    }
  );

  constructor(private title: Title, private datePipe: DatePipe,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService, private customerService: CustomerService) {
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.titleString = "Thêm thông tin khách hàng";
      this.btnSave = "Thêm mới";
    } else {
      this.titleString = "Cập nhật thông tin khách hàng";
      this.btnSave = "Cập nhật";
      this.findCustomerById(this.activatedRoute.snapshot.params["id"]);
    }
    this.title.setTitle(this.titleString);
  }

  addAccount() {
    this.isShowDisplayAccount = !this.isShowDisplayAccount;
    const accountControl = this.customerForm.get('account');
    const accountEmailControl = accountControl?.get('email');
    const accountPasswordControl = accountControl?.get('password');
    const accountStatusControl = accountControl?.get('status');

    if (this.isShowDisplayAccount) {
      this.titleShowDisplayAccount = "Ẩn tài khoản";
      accountEmailControl?.setValidators([
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]);
      accountPasswordControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
      ]);
      accountStatusControl?.setValidators([Validators.required]);
    } else {
      this.titleShowDisplayAccount = "Thêm tài khoản";
      accountEmailControl?.setValidators([Validators.nullValidator]);
      accountPasswordControl?.setValidators([Validators.nullValidator]);
      accountStatusControl?.setValidators([Validators.required]);
    }
    accountEmailControl?.updateValueAndValidity();
    accountPasswordControl?.updateValueAndValidity();
    accountStatusControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.customerForm.invalid)
      return;
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.createCustomer();
    } else {
      this.updateCustomer();
    }
  }

  onDateInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    // Nếu người dùng không chọn ngày, set giá trị thành null
    this.customerForm.get('birthday')?.setValue(inputValue ? inputValue : null);
  }

  createCustomer() {
    if (this.customerForm.get('birthday')?.value !== null) {
      this.customerForm.get('birthday')?.setValue(new Date(this.customerForm.get('birthday')?.value));
    }
    this.customerService.create(this.customerForm.value).subscribe({
        next: () => {
          this.toastr.success("Thêm khách hàng thành công");
          this.router.navigateByUrl("/admin/customer");
        },
        error: (error: any) => {
          if (error.status === 400)
            this.toastr.error(error.error);
          else
            this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        }
      }
    );
  }

  updateCustomer() {
    if (this.customerForm.get('birthday')?.value !== null) {
      this.customerForm.get('birthday')?.setValue(new Date(this.customerForm.get('birthday')?.value));
    }
    this.customerService.update(this.customerForm.value).subscribe({
        next: () => {
          this.toastr.success("Cập nhật khách hàng thành công");
          this.router.navigateByUrl("/admin/customer");
        },
        error: (error: any) => {
          if (error.status === 400)
            this.toastr.error(error.error);
          else
            this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        }
      }
    );
  }

  findCustomerById(id: number) {
    this.customerService.findById(id).subscribe({
      next: (data: any) => {
        this.customerForm.patchValue(data);

        this.customerForm.get('birthday')?.setValue(this.datePipe.transform(data.birthday, 'yyyy-MM-dd'));
        if (data.account) {
          this.customerForm.get('account')?.get('status')?.setValue(data.account.status.toString());
          this.isShowDisplayAccount = true;
          this.isShowTileDisplayAccount = false;
          const accountControl = this.customerForm.get('account');
          const accountEmailControl = accountControl?.get('email');
          const accountPasswordControl = accountControl?.get('password');
          const accountStatusControl = accountControl?.get('status');
          accountEmailControl?.setValidators([Validators.required, Validators.maxLength(50), Validators.email]);
          accountPasswordControl?.setValidators([Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)]);
          accountStatusControl?.setValidators([Validators.required]);
          accountEmailControl?.updateValueAndValidity();
          accountPasswordControl?.updateValueAndValidity();
          accountStatusControl?.updateValueAndValidity();
        }
      },
      error: (error: any) => {
        this.toastr.error(error.error);
      }
    });
  }
}
