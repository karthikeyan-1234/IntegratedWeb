import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private products = signal<Product[]>([])

  constructor(private http:HttpClient) {

    this.http.get<Product[]>(environment.apiBaseUrl + "/Product/GetProductsAsync").subscribe((res) => {
      this.products.set(res)
    }, err => {
      console.log(err)
    })

  }

  getProducts() {
    return this.products.asReadonly();
  }

  getProductById(id: number){
    this.products().find(x => {
      return x.id == id;
    })
  }

  addProduct(product: Product): void {
  this.products.update(products => [...products, product]);
}
}
