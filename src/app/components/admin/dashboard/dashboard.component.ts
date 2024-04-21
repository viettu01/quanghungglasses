import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {ReportService} from "../../../service/report.service";
import {ReceiptService} from "../../../service/receipt.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  chart: any;
  years: number[] = [];
  months: string[] = [];
  totalMoneyOrder: number[] = [];
  totalMoneyReceipt: number[] = [];

  constructor(private reportService: ReportService, private receiptService: ReceiptService) {

  }

  ngOnInit(): void {
    this.reportOrder();
    this.receiptReport();
    this.createChart();
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: this.months,
        datasets: [
          {
            label: "Tiền nhập hàng",
            data: this.totalMoneyReceipt,
            backgroundColor: '#ff4b4b'
          },
          {
            label: "Tiền bán hàng",
            data: this.totalMoneyOrder,
            backgroundColor: '#3874ff'
          }
        ]
      },
      options: {
        aspectRatio: 2.5,
      }
    });
  }

  reportOrder() {
    this.reportService.orderReport(2024).subscribe({
      next: (response: any) => {
        response.forEach((item: any) => {
          this.months.push("Tháng " + item.month);
          this.totalMoneyOrder.push(item.totalMoneyOrder);
        });
        // update chart
        this.chart.update();
      }
    });
  }

  receiptReport() {
    this.reportService.receiptReport(2024).subscribe({
      next: (response: any) => {
        response.forEach((item: any) => {
          this.totalMoneyReceipt.push(item.totalMoneyReceipt);
        });
        // update chart
        this.chart.update();
      }
    });
  }
}
