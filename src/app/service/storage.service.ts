import {Injectable} from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {LoginDto} from "../dto/login.dto";
import {TokenService} from "./token.service";
import {RegisterDto} from "../dto/register.dto";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private apiCategoryUrl = `${Environment.apiBaseUrl}/images`;

  constructor(private http: HttpClient) {
  }

  deleteImage(imageName: string) {
    return this.http.delete(`${this.apiCategoryUrl}/${imageName}`);
  }
}
