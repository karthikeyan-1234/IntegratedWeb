import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class LandingService {

  private products = signal<Product[]>([])

  constructor() { 

    this.products.set([
      {
        id: 1,
        name: 'HeadPhones',
        price: 50,
        image: 'images/headphones.jpg',
        description: 'HeadPhones'
      },
      {
        id: 2,
        name: 'Camera',
        price: 70,
        image: 'images/camera.jpg',
        description: 'Camera'
      },
      {
        id: 3,
        name: 'Watches',
        price: 70,
        image: 'images/watches.jpg',
        description: 'Watches'
      },
      {
        id: 4,
        name: 'HandBag',
        price: 70,
        image: 'images/handbag.jpg',
        description: 'HandBag'
      },
    ])

  }

  getProducts() {
    return this.products.asReadonly();
  }

  getProductById(id: number){
    this.products().find(x => {
      return x.id == id;
    })
  }
}
