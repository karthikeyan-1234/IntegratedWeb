import { Component, OnInit, OnDestroy, Signal, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

// Services
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';

// Models
import { CartItem } from '../../models/cart-item.model';
import { PaymentIntentCreateRequest } from '../../models/PaymentIntentCreateRequest';
// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  // Services
  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Cart Data
  cartItems: Signal<CartItem[]>;
  cartTotal: Signal<number>;

  // Stripe Integration
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;

  // Component State
  isLoading = false;
  paymentInitializing = false;
  paymentError = '';
  paymentStatus = '';
  paymentCompleted = false;
  orderId = '';
  clientSecret = '';
  showPaymentForm = false;

  constructor() {
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.cartTotal;
  }

  async ngOnInit(): Promise<void> {
    await this.loadStripe();
  }

  ngOnDestroy(): void {
    this.cleanupStripe();
     this.unloadStripe();
  }

  /**
   * Loads Stripe library
   */
  private async loadStripe(): Promise<void> {
    try {
      this.stripe = await loadStripe(environment.stripePublishableKey);
      if (!this.stripe) {
        this.showError('Failed to load payment system');
      }
    } catch (error: any) {
      this.showError('Payment system unavailable: ' + error.message);
    }
  }

  /**
   * Handles payment submission
   */
  async handlePaymentSubmit(): Promise<void> {
    // Validate
    if (this.isEmptyCart()) {
      this.showError('Your cart is empty');
      return;
    }

    if (!this.stripe) {
      this.showError('Payment system not available');
      return;
    }

    // Reset state
    this.paymentError = '';
    this.paymentStatus = '';

    // If we haven't created payment intent yet
    if (!this.clientSecret) {
      await this.createPaymentIntentAndSetupForm();
    } 
    // If we have the payment form ready
    else if (this.showPaymentForm && this.elements) {
      await this.confirmPayment();
    }
  }

  /**
   * Creates payment intent and sets up payment form
   */
  private async createPaymentIntentAndSetupForm(): Promise<void> {
    this.isLoading = true;
    this.paymentInitializing = true;

    try {
      // Step 1: Create payment intent
      const success = await this.createPaymentIntent();
      if (!success) return;

      // Small delay to ensure DOM is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 2: Setup payment element
      await this.setupPaymentElement();

    } catch (error: any) {
      this.handlePaymentError(error);
    } finally {
      this.isLoading = false;
      this.paymentInitializing = false;
    }
  }

  /**
   * Creates payment intent
   */
  private async createPaymentIntent(): Promise<boolean> {
    try {
      this.paymentStatus = 'initializing';

      // Generate order ID
      this.orderId = uuidv4();

      // Convert total to paise
      const amountInPaise = Math.round(this.cartTotal() * 100);

      // Create payment request
      const paymentIntentRequest: PaymentIntentCreateRequest = {
        amount: amountInPaise,
        currency: 'inr',
        orderId: this.orderId
      };

      // Call CheckoutService
      const response = await firstValueFrom(
        this.checkoutService.createPaymentIntent(paymentIntentRequest)
      );

      if (response && response.clientSecret) {
        this.clientSecret = response.clientSecret;
        this.showInfo('Payment initialized. Enter your card details.');
        return true;
      } else {
        this.showError('Failed to create payment intent');
        return false;
      }

    } catch (error: any) {
      this.handleHttpError(error);
      return false;
    }
  }

  /**
   * Sets up Stripe Payment Element
   */
  private async setupPaymentElement(): Promise<void> {
    if (!this.stripe || !this.clientSecret) {
      this.showError('Payment not ready');
      return;
    }

    try {
      // Clean up any existing elements
      this.cleanupStripe();

      // Initialize Elements group
      this.elements = this.stripe.elements({
        clientSecret: this.clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1976d2',
            borderRadius: '8px'
          }
        }
      });

      // Create payment element
      const paymentElement = this.elements.create('payment', {
        layout: {
          type: 'tabs',
          defaultCollapsed: false
        }
      });

      // Wait for DOM to be ready
      await this.waitForElement('#payment-element');

      // Mount to DOM
      const container = document.getElementById('payment-element');
      if (container) {
        // Clear container first
        container.innerHTML = '';
        paymentElement.mount('#payment-element');
        this.showPaymentForm = true;
        this.showInfo('Enter your payment details and click "Confirm Payment"');
      } else {
        throw new Error('Payment form container not found. Please refresh the page.');
      }

    } catch (error: any) {
      this.showError('Failed to setup payment form: ' + error.message);
    }
  }

  /**
   * Waits for element to be available in DOM
   */
  private waitForElement(selector: string): Promise<Element> {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found after 5 seconds`));
      }, 5000);
    });
  }

  /**
   * Confirms the payment using Elements group
   */
  private async confirmPayment(): Promise<void> {
    if (!this.stripe || !this.elements) {
      this.showError('Payment form not ready');
      return;
    }

    this.isLoading = true;
    this.paymentStatus = 'processing';

    try {
      const result = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      this.handlePaymentResult(result);

    } catch (error: any) {
      this.handlePaymentError(error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Handles payment result
   */
  private handlePaymentResult(result: any): void {
    if (result.error) {
      this.paymentError = result.error.message || 'Payment failed';
      this.paymentStatus = 'failed';
      this.showError(this.paymentError);
    } else if (result.paymentIntent) {
      this.processPaymentIntent(result.paymentIntent);
    }
  }

  /**
   * Processes payment intent status
   */
  private processPaymentIntent(paymentIntent: any): void {
    switch (paymentIntent.status) {
      case 'succeeded':
        this.handlePaymentSuccess();
        break;
      case 'processing':
        this.paymentStatus = 'processing';
        this.showInfo('Payment processing. Please wait...');
        break;
      case 'requires_payment_method':
        this.paymentError = 'Payment failed. Please try another method.';
        this.paymentStatus = 'failed';
        this.showError(this.paymentError);
        break;
      default:
        this.paymentError = 'Payment incomplete';
        this.paymentStatus = 'failed';
        this.showError(this.paymentError);
    }
  }

  /**
   * Handles successful payment
   */
  private handlePaymentSuccess(): void {
    this.paymentStatus = 'succeeded';
    this.paymentCompleted = true;
    this.cartService.clearCart();
    
    this.showSuccess('Payment successful!');
    
    setTimeout(() => {
      this.router.navigate(['/payment-success'], {
        state: { 
          orderId: this.orderId, 
          amount: this.cartTotal() 
        }
      });
    }, 2000);
  }

  /**
   * Handles HTTP errors
   */
  private handleHttpError(error: any): void {
    let errorMessage = 'Payment initialization failed';
    
    if (error.status === 0) {
      errorMessage = 'Cannot connect to payment server. Check your network or CORS settings.';
    } else if (error.status === 404) {
      errorMessage = `Payment endpoint not found at: ${environment.paymentBaseUrl}/Payments/create-payment-intent`;
    } else if (error.status === 500) {
      errorMessage = 'Payment server error. Please try again later.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    this.paymentError = errorMessage;
    this.showError(errorMessage);
    console.error('Payment HTTP error:', error);
  }

  /**
   * Handles payment errors
   */
  private handlePaymentError(error: any): void {
    this.paymentError = error.message || 'Payment failed';
    this.paymentStatus = 'failed';
    this.showError(this.paymentError);
    console.error('Payment error:', error);
  }

  /**
   * Cleans up Stripe elements
   */
  private cleanupStripe(): void {
    if (this.elements) {
      try {
        // Elements group doesn't have a destroy method, just set to null
      } catch (e) {
        // Ignore errors
      }
      this.elements = null;
    }
    this.showPaymentForm = false;
  }


  /**
 * Removes Stripe from the page
 */
private unloadStripe(): void {
  // Remove Stripe.js script
  const stripeScript = document.querySelector('script[src*="js.stripe.com"]');
  if (stripeScript) {
    stripeScript.remove();
  }
  
  // Remove Stripe elements from DOM
  const stripeElements = document.querySelectorAll('[class*="stripe-"], [class*="Stripe"]');
  stripeElements.forEach(element => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
  
  // Clear Stripe instance
  this.stripe = null;
  this.elements = null;
  
  // Remove any iframes added by Stripe
  const stripeIframes = document.querySelectorAll('iframe[src*="stripe"]');
  stripeIframes.forEach(iframe => iframe.remove());
}

  /**
   * Shows notifications
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 8000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['info-snackbar']
    });
  }

  /**
   * Cart Operations
   */
  getLineTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCartById(productId);
  }

  increaseQuantity(productId: number): void {
    const item = this.cartItems().find(x => x.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems().find(x => x.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  isEmptyCart(): boolean {
    return this.cartItems().length === 0;
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  retryPayment(): void {
    this.paymentError = '';
    this.paymentStatus = '';
    this.clientSecret = '';
    this.showPaymentForm = false;
    this.cleanupStripe();
    
    // Clear payment element container
    const container = document.getElementById('payment-element');
    if (container) {
      container.innerHTML = '<p class="payment-placeholder">Payment form will appear here</p>';
    }
  }
}