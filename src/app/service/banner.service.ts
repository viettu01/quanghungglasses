import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SupplierDto} from "../dto/supplier.dto";
import {BannerDto} from "../dto/banner.dto";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiBannerAdminUrl = `${Environment.apiBaseUrl}/admin/banner`;
  private apiBannerUrl = `${Environment.apiBaseUrl}/banner`;
  private apiConfigUrl = {headers: {'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryABCDEF123456'}};

  constructor(private http: HttpClient, private tokenService: TokenService) {

  }

  findAllByName(nameSearch: string = "", pageSize: number, pageNumber: any, sortDir: string, sortBy: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("name", nameSearch);
    queryParams = queryParams.append("page-size", pageSize);
    queryParams = queryParams.append("page-number", pageNumber);
    queryParams = queryParams.append("sort-direction", sortDir);
    queryParams = queryParams.append("sort-by", sortBy);
    return this.http.get(this.apiBannerAdminUrl, {params: queryParams});
  }

  findAll() {
    return this.http.get(this.apiBannerUrl);
  }

  create(bannerDto: BannerDto, multipartFileImage: File) {
    const formData = new FormData();
    formData.append('name', bannerDto.name);
    formData.append('multipartFileImage', multipartFileImage);
    formData.append('status', bannerDto.status.toString());
    formData.append('staffEmail', this.tokenService.getUserEmail());
    return this.http.post(this.apiBannerAdminUrl, formData);
  }

  update(bannerDto: BannerDto, multipartFileImage: File) {
    const formData = new FormData();
    formData.append('id', bannerDto.id.toString());
    formData.append('name', bannerDto.name);
    formData.append('multipartFileImage', multipartFileImage);
    formData.append('status', bannerDto.status.toString());
    formData.append('staffEmail', this.tokenService.getUserEmail());
    return this.http.put(this.apiBannerAdminUrl, formData);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiBannerAdminUrl}/${id}`,);
  }

  findById(id: number) {
    return this.http.get(`${this.apiBannerAdminUrl}/${id}`);
  }
}
