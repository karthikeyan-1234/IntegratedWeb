import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => {

    let count = 0;

    this.cartItems().forEach(x => {
      count = count + x.quantity;
    })

    return count;

  })


  cartTotal = computed(() => {

    let total = 0;

    this.cartItems().forEach(x => {
      total = total + (x.product.price * x.quantity);
    })

    return total;
  })

  constructor(){
    this.cartItems.set(
      [
        {
          product: {
            id: 1, 
            name: 'HeadPhones', 
            price: 50, 
            image: 'images/headphones.jpg'
          },
          quantity: 1
        },
        {
          product: {
        id: 2,
        name: 'Camera',
        price: 70,
        image: 'images/camera.jpg',
        description: 'Camera'
      },
          quantity: 2
        }
      ]
    )
  }


  addToCart(newProduct: Product):boolean{
    
    var existingProduct = this.cartItems().find(x => x.product.id === newProduct.id);    

    if(existingProduct){
      return false;
    }

    this.cartItems.update(oldItems => {
      return [...oldItems, {product:newProduct, quantity:1}] //use spread operator to add new product to the oldItems 
    })

    return true;

  }

  removeFromCart(existingProduct: Product):boolean{
    var isExists = this.cartItems().find(x => x.product.id === existingProduct.id);

    if(isExists){
      this.cartItems.update(oldItems => {
        return oldItems.filter(x => x.product.id!= existingProduct.id)
      })
      return true;
    }

    return false;
  }

  removeFromCartById(productId: number):void{
    var isExists = this.cartItems().find(x => x.product.id === productId)

    if(isExists){
      this.cartItems.update(oldItems => {
        return oldItems.filter(x => x.product.id != productId)
      })
    }
  }

  updateQuantity(productId: number, quantity: number) {
  this.cartItems.update(items =>
    items.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    )
  );
}

  getCartItems(){
    return this.cartItems
  }

  clearCart(){
    this.cartItems.set([]);
  }
}
