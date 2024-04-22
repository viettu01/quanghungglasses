import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {ReportService} from "../../../service/report.service";
import {ReceiptService} from "../../../service/receipt.service";
import {OrderService} from "../../../service/order.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chartOrder: any;
  chartReceipt: any;
  years: number[] = [];
  selectOrderYear: number = new Date().getFullYear();
  selectReceiptYear: number = new Date().getFullYear();
  months: string[] = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  totalMoneyOrder: number[] = [];
  totalMoneyReceipt: number[] = [];

  constructor(private reportService: ReportService, private receiptService: ReceiptService, private orderService: OrderService) {

  }

  ngOnInit(): void {
    this.reportOrder(this.selectOrderYear);
    this.receiptReport(this.selectReceiptYear);
    this.createChartOrder();
    this.createChartReceipt();
    this.getYears();
  }

  createChartOrder() {
    this.chartOrder = new Chart("chartOrder", {
      type: 'bar',
      data: {
        labels: this.months,
        datasets: [
          {
            label: "Tiền bán hàng",
            data: [],
            backgroundColor: '#3874ff'
          }
        ]
      },
      options: {
        aspectRatio: 2,
      }
    });
  }

  createChartReceipt() {
    this.chartReceipt = new Chart("chartReceipt", {
      type: 'bar',
      data: {
        labels: this.months,
        datasets: [
          {
            label: "Tiền nhập hàng",
            data: [],
            backgroundColor: '#ff4b4b'
          }
        ]
      },
      options: {
        aspectRatio: 2,
      }
    });
  }

  setDataToChartOrder() {
    this.chartOrder.data.datasets[0].data = this.totalMoneyOrder;
    this.chartOrder.update();
  }

  setDataToChartReceipt() {
    this.chartReceipt.data.datasets[0].data = this.totalMoneyReceipt;
    this.chartReceipt.update();
  }

  reportOrder(year: number) {
    this.reportService.orderReport(year).subscribe({
      next: (response: any) => {
        response.forEach((item: any) => {
          this.totalMoneyOrder.push(item.totalMoneyOrder);
        });
        this.setDataToChartOrder();
      }
    });
  }

  receiptReport(year: number) {
    this.reportService.receiptReport(year).subscribe({
      next: (response: any) => {
        response.forEach((item: any) => {
          this.totalMoneyReceipt.push(item.totalMoneyReceipt);
        });
        this.setDataToChartReceipt();
      }
    });
  }

  onChangeOrderYear() {
    this.totalMoneyOrder = [];
    this.reportOrder(this.selectOrderYear);
  }

  onChangeReceiptYear() {
    this.totalMoneyReceipt = [];
    this.receiptReport(this.selectReceiptYear);
  }

  getYears() {
    this.orderService.findAll("", Math.pow(2, 31) - 1, 1, "", "").subscribe({
      next: (response: any) => {
        response.content.forEach((item: any) => {
          let year = new Date(item.createdDate).getFullYear();
          if (!this.years.includes(year)) {
            this.years.push(year);
          }
        });
      }
    });
    this.receiptService.findAll("", null, Math.pow(2, 31) - 1, 1, "", "").subscribe({
      next: (response: any) => {
        response.content.forEach((item: any) => {
          let year = new Date(item.createdDate).getFullYear();
          if (!this.years.includes(year)) {
            this.years.push(year);
          }
        });
      }
    });
  }
}
