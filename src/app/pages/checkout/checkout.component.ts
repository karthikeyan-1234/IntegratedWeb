import { Component, Signal } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cart-item.model';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule,RouterModule, MatCardModule, MatButtonModule,MatDividerModule,MatListModule,
    MatTableModule, MatIconModule, CommonModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  cartItems: Signal<CartItem[]>
  cartTotal: Signal<number>
  displayedColumns: string[] = ['product', 'price', 'quantity', 'total'];


  constructor(private checkOutService: CheckoutService, private cartService: CartService, private router: Router){
    this.cartItems = this.cartService.getCartItems()
    this.cartTotal = this.cartService.cartTotal
  }

  getCartSummary() {
    return this.checkOutService.getCartSummary();
  }

  getLineTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCartById(productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

    increaseQuantity(productId: number): void {
    const currentItem = this.cartItems().find(item => item.product.id === productId);
    if (currentItem) {
      this.updateQuantity(productId, currentItem.quantity + 1);
    }
  }

    decreaseQuantity(productId: number): void {
    const currentItem = this.cartItems().find(item => item.product.id === productId);
    if (currentItem && currentItem.quantity > 1) {
      this.updateQuantity(productId, currentItem.quantity - 1);
    }
  }


    isEmptyCart(): boolean {
    return this.cartItems().length === 0;
  }

    continueShopping(): void {
    this.router.navigate(['/']);
  }

    processCheckout(): void {
    if (this.isEmptyCart()) {
      alert('Your cart is empty!');
      return;
    }
    
    // In a real app, this would integrate with payment gateway
    alert(`Order placed successfully! Total: ${this.cartTotal()}`);
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }


  getCheckoutButtonText(): string {
    return this.isEmptyCart() ? 'Cart is Empty' : `Place Order - ${this.cartTotal()}`;
  }



}
