import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {StaffService} from "../../../../service/staff.service";
import {StaffDto} from "../../../../dto/staff.dto";

@Component({
  selector: 'app-staff-save',
  templateUrl: './staff-save.component.html',
  styleUrls: ['./staff-save.component.css']
})
export class StaffSaveComponent implements OnInit {
  titleString: string = "";
  isDisplayNone: boolean = false;
  isShowDisplayAccount: boolean = false;
  isShowTileDisplayAccount: boolean = true;
  titleShowDisplayAccount: string = "Thêm tài khoản";
  btnSave: string = "";

  staffForm: FormGroup = new FormGroup({
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
      staffStatus: new FormControl('true', [Validators.required]),
      account: new FormGroup(
        {
          id: new FormControl(null),
          email: new FormControl(''),
          password: new FormControl(''),
          roleIds: new FormArray([]),
          status: new FormControl('true'),
        }
      )
    }
  );

  constructor(private title: Title, private datePipe: DatePipe,
              private activatedRoute: ActivatedRoute, private router: Router,
              private toastr: ToastrService, private staffService: StaffService) {
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.titleString = "Thêm thông tin nhân viên";
      this.btnSave = "Thêm mới";
    } else {
      this.titleString = "Cập nhật thông tin nhân viên";
      this.btnSave = "Cập nhật";
      this.findCustomerById(this.activatedRoute.snapshot.params["id"]);
    }
    this.title.setTitle(this.titleString);
  }

  onDateInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    // Nếu người dùng không chọn ngày, set giá trị thành null
    this.staffForm.get('birthday')?.setValue(inputValue ? inputValue : null);
  }

  onCheckboxRoleChange(e: any) {
    const roleIds: FormArray = this.staffForm.get('account')?.get('roleIds') as FormArray;

    if (e.target.checked) {
      roleIds.push(new FormControl(e.target.value));
      // this.selectedCheckBoxList.push(e.target.value);
    } else {
      const index = roleIds.controls.findIndex(roleId => roleId.value === e.target.value);
      roleIds.removeAt(index);
    }
  }

  onCheckedRole(roleId: number) {
    const roleIds: FormArray = this.staffForm.get('account')?.get('roleIds') as FormArray;
    return roleIds.value.includes(roleId);
  }

  addAccount() {
    this.isShowDisplayAccount = !this.isShowDisplayAccount;
    const accountControl = this.staffForm.get('account');
    const accountEmailControl = accountControl?.get('email');
    const accountPasswordControl = accountControl?.get('password');
    const accountStatusControl = accountControl?.get('status');
    const roleIdsControl = accountControl?.get('roleIds') as FormArray;
    roleIdsControl.push(new FormControl(2));

    if (this.isShowDisplayAccount) {
      this.titleShowDisplayAccount = "Ẩn tài khoản";
      accountEmailControl?.setValidators([Validators.required, Validators.maxLength(50), Validators.email]);
      accountPasswordControl?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)]);
      accountStatusControl?.setValidators([Validators.required]);
      roleIdsControl.setValidators([Validators.required]);
    } else {
      this.titleShowDisplayAccount = "Thêm tài khoản";
      accountEmailControl?.setValidators([Validators.nullValidator]);
      accountPasswordControl?.setValidators([Validators.nullValidator]);
      accountStatusControl?.setValidators([Validators.required]);
      roleIdsControl.setValidators([Validators.nullValidator]);
    }
    accountEmailControl?.updateValueAndValidity();
    accountPasswordControl?.updateValueAndValidity();
    accountStatusControl?.updateValueAndValidity();
    roleIdsControl.updateValueAndValidity();
  }

  onSubmit() {
    if (this.staffForm.invalid)
      return;
    if (this.activatedRoute.snapshot.params["id"] === undefined) {
      this.createStaff();
    } else {
      this.updateStaff();
    }
  }

  createStaff() {
    const staffDto: StaffDto = this.staffForm.value;
    if (this.staffForm.get('birthday')?.value !== null) {
      staffDto.birthday = new Date(this.staffForm.get('birthday')?.value);
    }
    staffDto.status = this.staffForm.get('staffStatus')?.value;
    staffDto.account.roleIds = this.staffForm.get('account')?.get('roleIds')?.value;
    this.staffService.create(staffDto).subscribe({
        next: () => {
          this.toastr.success("Thêm nhân viên thành công");
          this.router.navigateByUrl("/admin/staff");
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

  updateStaff() {
    const staffDto: StaffDto = this.staffForm.value;
    if (this.staffForm.get('birthday')?.value !== null) {
      staffDto.birthday = new Date(this.staffForm.get('birthday')?.value);
    }
    staffDto.status = this.staffForm.get('staffStatus')?.value;
    staffDto.account.roleIds = this.staffForm.get('account')?.get('roleIds')?.value;

    this.staffService.update(staffDto).subscribe({
        next: () => {
          this.toastr.success("Cập nhật nhân viên thành công");
          this.router.navigateByUrl("/admin/staff");
        },
        error: (error: any) => {
          console.log(error);
          if (error.status === 400)
            this.toastr.error(error.error);
          else
            this.toastr.error('Lỗi thực hiện, vui lòng thử lại sau');
        }
      }
    );
  }

  findCustomerById(id: number) {
    this.staffService.findById(id).subscribe({
      next: (data: any) => {
        this.staffForm.patchValue(data);
        this.staffForm.get('birthday')?.setValue(this.datePipe.transform(data.birthday, 'yyyy-MM-dd'));
        this.staffForm.get('staffStatus')?.setValue(data.status.toString());
        if (data.account) {
          this.staffForm.get('account')?.get('status')?.setValue(data.account.status.toString());
          this.isShowDisplayAccount = true;
          this.isShowTileDisplayAccount = false;
          const accountControl = this.staffForm.get('account');
          const accountEmailControl = accountControl?.get('email');
          const accountPasswordControl = accountControl?.get('password');
          const accountRoleIdsControl = accountControl?.get('roleIds') as FormArray;
          const accountStatusControl = accountControl?.get('status');
          accountEmailControl?.setValidators([Validators.required, Validators.maxLength(50), Validators.email]);
          accountPasswordControl?.setValidators([Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)]);
          accountRoleIdsControl?.setValidators([Validators.required]);
          accountStatusControl?.setValidators([Validators.required]);
          accountEmailControl?.updateValueAndValidity();
          accountPasswordControl?.updateValueAndValidity();
          accountRoleIdsControl?.updateValueAndValidity();
          accountStatusControl?.updateValueAndValidity();
          for (let i = 0; i < data.account.roles.length; i++) {
            accountRoleIdsControl.push(new FormControl(data.account.roles[i].id));
          }
        }
      },
      error: () => {
      }
    });
  }
}
