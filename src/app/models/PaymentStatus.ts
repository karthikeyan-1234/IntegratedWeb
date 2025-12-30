export interface PaymentStatus {
  status: 'succeeded' | 'pending' | 'failed' | 'canceled';
  message: string;
  paymentIntentId?: string;
}