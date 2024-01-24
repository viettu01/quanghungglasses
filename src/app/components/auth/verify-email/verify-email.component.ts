import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  onCodeChanged(code: string) {
  }

// this called only if user entered full code
  onCodeCompleted(code: string) {
  }
}
