import { Component, HostListener, Signal } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { CartPopupComponent } from '../cart-popup/cart-popup.component';
import { ProductFormPopupComponent } from '../product-form-popup/product-form-popup.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    RouterModule,
    CartPopupComponent,
    ProductFormPopupComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  cartCount : Signal<number>;
  isCartOpen: boolean = false;
  isProductFormOpen = false;

  constructor(private cartService: CartService, private router: Router){
    this.cartCount = this.cartService.cartCount;
  }

  navigateToCheckOut(){
    this.router.navigate(['/checkout'])
  }

  toggleCart(){
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(){
    this.isCartOpen = false;
  }

  closeProductForm() {
    this.isProductFormOpen = false;
  }

  toggleProductForm() {
    this.isProductFormOpen = !this.isProductFormOpen;
    if (this.isProductFormOpen) {
      this.isCartOpen = false; // Close cart if product form opens
    }
  }


  closeAllPopups() {
    this.isCartOpen = false;
    this.isProductFormOpen = false;
  }

  // Close cart on escape key press
  @HostListener('document:keydown.escape')
  onEscapeKey() { this.closeCart(); }

  preventClose($event: Event) {
    $event.stopPropagation();
  }

}
