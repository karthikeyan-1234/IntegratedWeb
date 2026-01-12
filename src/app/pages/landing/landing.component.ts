import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { LandingService } from '../../services/landing.service';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TestSignalService } from '../../services/test-signal.service';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterModule, MatGridListModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  products: Signal<Product[]>
  cartItems: Signal<CartItem[]>

  constructor(private landingService:LandingService, private cartService:CartService, private router:Router, private testService:TestSignalService){
    this.products = this.landingService.getProducts()
    this.cartItems = this.cartService.getCartItems()

    
  }

  isProductInCart(productId: number):boolean{
    return this.cartItems().some(x => x.product.id === productId)
  }

  getProductQuantity(productId: number): number {
    const qty = this.cartItems().find(x => x.product.id === productId)?.quantity
    return qty ? qty : 0
  }

  addToCart(product: Product){
    this.cartService.addToCart(product)
  }

  removeFromCart(productId: number){
    const product = this.cartItems().find(x => x.product.id === productId)

    if(product)
      this.cartService.removeFromCartById(productId)
  }

  navigateToCheckOut(){
    this.router.navigate(["/checkout"]);
  }

  toggleCart(product: Product){
    if(this.cartItems().find(x => x.product.id === product.id))
      this.cartService.removeFromCart(product)
    else
      this.cartService.addToCart(product)
  }

  getCartIcon(productId:number):string{
    return this.isProductInCart(productId) ? 'remove_shopping_cart' : 'add_shopping_cart'
  }

  getCartButtonColor(productId:number):string{
    return this.isProductInCart(productId) ? 'warn' : 'primary'
  }

  getCartToolTip(productId: number):string{
    return this.isProductInCart(productId) ? 'Remove from cart' : 'Add to cart'
  }

}
