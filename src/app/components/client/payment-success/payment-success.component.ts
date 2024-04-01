import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  orderId: number = 0;

  constructor(private title: Title, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.title.setTitle('Thanh toán thành công');
    this.orderId = this.activatedRoute.snapshot.params['orderId'];
  }

}
