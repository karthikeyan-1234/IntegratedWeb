import { Injectable, signal } from '@angular/core';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item.model';
import { PaymentIntentCreateRequest } from '../models/PaymentIntentCreateRequest';
import { PaymentIntentResponse } from '../models/PaymentIntentResponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  cartItems = signal<CartItem[]>([])
  cartTotal: number = 0;

  constructor(private cartService: CartService,private http:HttpClient) { 
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

    createPaymentIntent(request: PaymentIntentCreateRequest): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(
      `${environment.paymentBaseUrl}/Payments/create-payment-intent`,
      request
    );
  }

    confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(
      `${environment.paymentBaseUrl}/Payments/confirm-payment`,
      { paymentIntentId }
    );
  }

}
