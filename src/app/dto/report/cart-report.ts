export class CartReport {
  productDetailsId: number;
  productThumbnails: number;
  productName: number;
  productColor: number;
  totalQuantityInStock: number;
  totalQuantityInCart: number;

  constructor(productDetailsId: number, productThumbnails: number, productName: number, productColor: number, totalQuantityInStock: number, totalQuantityInCart: number) {
    this.productDetailsId = productDetailsId;
    this.productThumbnails = productThumbnails;
    this.productName = productName;
    this.productColor = productColor;
    this.totalQuantityInStock = totalQuantityInStock;
    this.totalQuantityInCart = totalQuantityInCart;
  }
}
