import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../../models/cart-item.model';
import { MatList, MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart-popup',
  imports: [CommonModule,MatCardModule, MatDividerModule, MatIconModule, MatListModule, MatButtonModule],
  templateUrl: './cart-popup.component.html',
  styleUrl: './cart-popup.component.css'
})
export class CartPopupComponent {


  cartItems!: Signal<CartItem[]>
  cartTotal!: Signal<number>

  constructor(private cartService: CartService){
    this.cartItems = this.cartService.getCartItems()
    this.cartTotal = this.cartService.cartTotal
  }


  removeItem(productId:number){
    this.cartService.removeFromCartById(productId)
  }

  increaseQuantity(productId: number): void{

    const currentQty = this.cartItems().find(x => x.product.id === productId)?.quantity
    if(currentQty)
      this.cartService.updateQuantity(productId, currentQty + 1)
    else
      this.cartService.updateQuantity(productId, 1)
  }

  decreaseQuantity(productId: number): void{
    const currentQty = this.cartItems().find(x => x.product.id === productId)?.quantity
    if(currentQty)
      this.cartService.updateQuantity(productId, currentQty - 1)
    else
      this.cartService.updateQuantity(productId, 0)
  }

  isEmptyCart():boolean{
    return this.cartItems().length === 0
  }


  getLineTotal(item: CartItem): string|number {
    return item.product.price * item.quantity
  }

}
