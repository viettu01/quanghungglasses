import {BaseDto} from "./base.dto";

export class BannerDto extends BaseDto {
  id: number;
  name: string;
  image: string;
  status: boolean;
  staffEmail: string;

  constructor(createdDate: Date, updatedDate: Date, id: number, name: string, image: string, status: boolean, staffEmail: string) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
    this.image = image;
    this.status = status;
    this.staffEmail = staffEmail;
  }
}
