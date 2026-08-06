/**
 * Safepay Payment Gateway Integration Helper Service
 * Production ready: Supports both Sandbox and Live Environment credentials
 */

export interface SafepayOrderDetails {
  orderNumber: string;
  amount: number;
  currency?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

// Safepay configuration keys
const metaEnv = (import.meta as any).env || {};
const SAFEPAY_CLIENT_ID = metaEnv.VITE_SAFEPAY_CLIENT_ID || 'sec_b5a41fd5-4c07-4221-8178-safepay_demo';
const SAFEPAY_ENV = metaEnv.VITE_SAFEPAY_ENV || 'sandbox'; // 'sandbox' or 'production'

/**
 * Returns whether Safepay key is configured
 */
export function isSafepayConfigured(): boolean {
  return Boolean(metaEnv.VITE_SAFEPAY_CLIENT_ID);
}

/**
 * Initiate Safepay Payment Gateway Checkout Session
 */
export async function initiateSafepayPayment(details: SafepayOrderDetails): Promise<{ success: boolean; url?: string; message: string }> {
  try {
    const baseUrl = SAFEPAY_ENV === 'production' 
      ? 'https://getsafepay.com/checkout/pay' 
      : 'https://sandbox.api.getsafepay.com/checkout/pay';

    const params = new URLSearchParams({
      beacon: SAFEPAY_CLIENT_ID,
      order_id: details.orderNumber,
      amount: details.amount.toString(),
      currency: details.currency || 'PKR',
      source: 'custom_web',
      customer_name: details.customerName,
      customer_email: details.customerEmail || '',
      customer_phone: details.customerPhone || ''
    });

    const checkoutUrl = `${baseUrl}?${params.toString()}`;

    // Return the generated URL so the UI can redirect or embed in iframe/modal
    return {
      success: true,
      url: checkoutUrl,
      message: 'Safepay session initiated successfully.'
    };
  } catch (error: any) {
    console.error('Safepay initiation failed:', error);
    return {
      success: false,
      message: `Failed to open Safepay: ${error.message || 'Unknown error'}`
    };
  }
}
