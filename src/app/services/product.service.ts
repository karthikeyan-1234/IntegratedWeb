import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { 
  }

  getAllProducts():Observable<Product[]>{
    return this.http.get<Product[]>(environment.apiBaseUrl + "/Product/GetProductsAsync")
  }
}
