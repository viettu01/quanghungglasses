import {OrderDetailsDto} from "./order-details.dto";

export class OrderDto {
  id: number;
  fullname: string;
  address: string;
  phone: string;
  email: string;
  note: string;
  eyeglassPrescriptionImage: File;
  eyeglassPrescription: string = '';
  createdDate: Date;
  paymentDate: Date;
  paymentMethod: number;
  paymentStatus: boolean;
  completedDate: Date;
  orderStatus: number; // 0: chờ xác nhận, 1: đã xác nhận, 2: đang giao hàng, 3: đã giao hàng, 4: đã hủy
  orderDetails: OrderDetailsDto[];
  totalMoney: number = 0;

  constructor(id: number, fullname: string, address: string, phone: string, email: string, note: string, eyeglassPrescriptionImage: File, createdDate: Date, paymentDate: Date, paymentMethod: number, paymentStatus: boolean, completeDate: Date, orderStatus: number, orderDetails: OrderDetailsDto[]) {
    this.id = id;
    this.fullname = fullname;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.note = note;
    this.eyeglassPrescriptionImage = eyeglassPrescriptionImage;
    this.createdDate = createdDate;
    this.paymentDate = paymentDate;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
    this.completedDate = completeDate;
    this.orderStatus = orderStatus;
    this.orderDetails = orderDetails;
  }

  static createEmpty(): OrderDto {
    return new OrderDto(0, "", "", "", "", "", new File([], ''), new Date(), new Date(), 0, false, new Date(), 0, []);
  }
}
