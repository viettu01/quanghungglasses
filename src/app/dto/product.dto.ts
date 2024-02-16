import {BaseDto} from "./base.dto";
import {ProductDetailsDto} from "./product-details.dto";

export class ProductDto extends BaseDto {
  id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
  description: string;
  slug: string;
  status: boolean;
  categoryId: number;
  categoryName: string;
  materialId: number;
  materialName: string;
  originId: number;
  originName: string;
  shapeId: number;
  shapeName: string;
  brandId: number;
  brandName: string;
  productDetails: ProductDetailsDto[];

  constructor(createdDate: Date, updatedDate: Date,
              id: number, name: string, price: number, quantity: number, thumbnail: string, description: string, slug: string, status: boolean,
              categoryId: number, categoryName: string,
              materialId: number, materialName: string,
              originId: number, originName: string,
              shapeId: number, shapeName: string,
              brandId: number, brandName: string,
              productDetails: ProductDetailsDto[]) {
    super(createdDate, updatedDate);
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.thumbnail = thumbnail;
    this.description = description;
    this.slug = slug;
    this.status = status;
    this.categoryId = categoryId;
    this.categoryName = categoryName;
    this.materialId = materialId;
    this.materialName = materialName;
    this.originId = originId;
    this.originName = originName;
    this.shapeId = shapeId;
    this.shapeName = shapeName;
    this.brandId = brandId;
    this.brandName = brandName;
    this.productDetails = productDetails;
  }

  static createEmpty(): ProductDto {
    return new ProductDto(new Date(), new Date(), 0, "", 0, 0, "", "", "", false, 0, "", 0, "", 0, "", 0, "", 0, "", []);
  }
}
