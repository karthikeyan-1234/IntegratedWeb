import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class TestSignalService {

  products = signal<Product[]>([])

  productCount = computed(() => {
    return this.products().length
  })

  constructor() {

    const products = [
      {
        id: 1,
        name: "p1",
        price: 20.0,
        image: "image here",
        description: "description here"
      },
      {
        id: 2,
        name: "p2",
        price: 30.0,
        image: "image here",
        description: "description here"
      }
  ]

    this.products.set(products)
  }


  logProductChange = effect(() => {
    console.log("Products have changed", this.products())
    console.log("Num of Product ", this.productCount())
  })

}
