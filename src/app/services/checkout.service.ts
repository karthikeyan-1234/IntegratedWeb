import { Injectable, signal } from '@angular/core';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  cartItems = signal<CartItem[]>([])
  cartTotal: number = 0;

  constructor(private cartService: CartService) { 
      this.cartItems = this.cartService.getCartItems();
      this.cartTotal = this.cartService.cartTotal()
  }

  getCartSummary(){
    return this.cartItems().map(item => ({
      ...item,
      lineTotal: item.product.price * item.quantity
      
    })
  )
  }

}
