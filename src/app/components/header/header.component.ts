import { Component, HostListener, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

// Services
import { CartService } from '../../services/cart.service';

// Components
import { CartPopupComponent } from '../cart-popup/cart-popup.component';
import { ProductFormPopupComponent } from '../product-form-popup/product-form-popup.component';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component'; // NEW

@Component({
  selector: 'app-header',
  standalone: true, // Changed from imports to standalone
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    RouterModule,
    CartPopupComponent,
    ProductFormPopupComponent,
    SidebarMenuComponent // NEW
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Services
  private cartService = inject(CartService);
  private router = inject(Router);

  // Cart Data
  cartCount: Signal<number>;

  // Component State
  isCartOpen = false;
  isProductFormOpen = false;
  isSidebarOpen = false;
  currentRoute = '';

  constructor() {
    this.cartCount = this.cartService.cartCount;
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  // Navigation Methods
  navigateToCheckout() {
    this.router.navigate(['/checkout']);
    this.closeAllPopups();
  }

  // Sidebar Methods
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      // Close other popups when sidebar opens
      this.isCartOpen = false;
      this.isProductFormOpen = false;
    }
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  // Product Form Methods
  openProductForm() {
    this.isProductFormOpen = true;
    this.closeSidebar();
  }

  // Cart Methods
  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) {
      this.isProductFormOpen = false;
      this.isSidebarOpen = false;
    }
  }

  closeCart() {
    this.isCartOpen = false;
  }

  closeProductForm() {
    this.isProductFormOpen = false;
  }

  // Close All Methods
  closeAllPopups() {
    this.isCartOpen = false;
    this.isProductFormOpen = false;
    this.isSidebarOpen = false;
  }

  // Window resize listener
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  // Keyboard shortcuts
  @HostListener('document:keydown.escape')
  onEscapeKey() { 
    this.closeAllPopups();
  }

  // Prevent close when clicking inside popups
  preventClose($event: Event) {
    $event.stopPropagation();
  }
}