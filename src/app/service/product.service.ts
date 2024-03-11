import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ProductDto} from "../dto/product.dto";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiProductAdminUrl = `${Environment.apiBaseUrl}/admin/product`;
  private apiProductUrl = `${Environment.apiBaseUrl}/product`;

  constructor(private http: HttpClient) {

  }

  findAllByName(nameSearch: string = "", pageSize: number, pageNumber: any, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", nameSearch);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiProductAdminUrl, {params: queryParams});
  };

  findAll() {
    return this.http.get(this.apiProductUrl);
  };

  findBySlug(slug: string) {
    return this.http.get(`${this.apiProductUrl}/${slug}`);
  }

  findById(id: number) {
    return this.http.get(`${this.apiProductAdminUrl}/${id}`);
  }

  countByStatus(status: boolean) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("status", status);
    return this.http.get(`${this.apiProductAdminUrl}/count`, {params: queryParams});
  }

  countAll() {
    return this.http.get(`${this.apiProductAdminUrl}/count-all`);
  }

  create(product: ProductDto, thumbnailFile: File, imageProductFiles: File[]) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('thumbnailFile', thumbnailFile);
    formData.append('slug', product.slug);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('timeWarranty', product.timeWarranty.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('materialId', product.materialId.toString());
    formData.append('originId', product.originId.toString());
    formData.append('shapeId', product.shapeId.toString());
    formData.append('brandId', product.brandId.toString());
    formData.append('status', product.status.toString());
    for (let i = 0; i < product.productDetails.length; i++) {
      formData.append(`productDetails[${i}].color`, product.productDetails[i].color);
      formData.append(`productDetails[${i}].quantity`, '0');
    }
    for (let i = 0; i < imageProductFiles.length; i++) {
      formData.append('imageFiles', imageProductFiles[i]);
    }
    return this.http.post(this.apiProductAdminUrl, formData);
  }

  update(product: ProductDto, thumbnailFile: File, imageProductFiles: File[]) {
    const formData = new FormData();
    formData.append('id', product.id.toString());
    formData.append('name', product.name);
    formData.append('thumbnailFile', thumbnailFile);
    formData.append('slug', product.slug);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('timeWarranty', product.timeWarranty.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('materialId', product.materialId.toString());
    formData.append('originId', product.originId.toString());
    formData.append('shapeId', product.shapeId.toString());
    formData.append('brandId', product.brandId.toString());
    formData.append('status', product.status.toString());
    for (let i = 0; i < product.productDetails.length; i++) {
      if (product.productDetails[i].id !== null) {
        formData.append(`productDetails[${i}].id`, product.productDetails[i].id.toString());
      }
      formData.append(`productDetails[${i}].color`, product.productDetails[i].color);
      formData.append(`productDetails[${i}].quantity`, product.productDetails[i].quantity.toString());
    }
    for (let i = 0; i < imageProductFiles.length; i++) {
      formData.append('imageFiles', imageProductFiles[i]);
    }
    return this.http.put(this.apiProductAdminUrl, formData);
  }

  updateStatus(id: number) {
    return this.http.put(`${this.apiProductAdminUrl}/${id}/status`, null);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiProductAdminUrl}/${id}`,);
  }

  deleteProductDetails(id: number) {
    return this.http.delete(`${this.apiProductAdminUrl}/details/${id}`);
  }

  deleteImage(id: number, imageName: string) {
    return this.http.delete(`${this.apiProductAdminUrl}/${id}/images/${imageName}`);
  }
}
