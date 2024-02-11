import { Injectable } from '@angular/core';
import {Environment} from "../environment/environment";
import {HttpClient} from "@angular/common/http";
import {RegisterDto} from "../dto/register.dto";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiCategoryUrl = `${Environment.apiBaseUrl}`;
  private apiConfigUrl = {headers: {'Content-Type': 'application/json'}};

  constructor(private http: HttpClient) {
  }
}
