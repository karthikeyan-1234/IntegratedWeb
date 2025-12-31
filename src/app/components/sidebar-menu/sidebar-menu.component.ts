import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent {
  @Input() isOpen = false;
  @Input() currentRoute = '';
  
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() addProduct = new EventEmitter<void>();
  
  private router = inject(Router);

  // Emit close event
  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  // Emit add product event
  onAddProduct() {
    this.addProduct.emit();
  }

  // Check if route is active for highlighting
  isActiveRoute(route: string): boolean {
    return this.currentRoute === route;
  }

  // Prevent body scrolling when sidebar is open
  ngOnChanges() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy() {
    // Clean up: restore body scrolling
    document.body.style.overflow = '';
  }
}