export class BaseDto {
  createdDate: Date;
  updatedDate: Date;

  constructor(createdDate: Date, updatedDate: Date) {
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }
}
