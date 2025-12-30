export interface PaymentIntentCreateRequest {
  amount: number;      // Amount in smallest currency unit (paise for INR)
  currency: string;    // 'inr', 'usd', etc.
  orderId: string;     // UUID format
}