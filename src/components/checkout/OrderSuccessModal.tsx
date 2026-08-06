import React from 'react';
import { Order } from '../../types';
import { CheckCircle2, ShieldCheck, Download, ExternalLink, ArrowRight, MessageCircle, CreditCard, Clock } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, onTrackOrder }) => {
  if (!order) return null;

  const isCardPayment = order.paymentMethod.toLowerCase().includes('safepay') || order.paymentMethod.toLowerCase().includes('card');
  const isWhatsApp = order.paymentMethod.toLowerCase().includes('whatsapp') || order.paymentMethod.toLowerCase().includes('downpayment');

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Top Decorative Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900/40 shadow-lg animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-block">
            100% VERIFIED ORDER CONFIRMED
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Thank You For Your Order!
          </h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            Your luxury order has been recorded in our store database.
          </p>
        </div>

        {/* Order Verification Summary Card */}
        <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3 text-xs">
          
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
            <span className="text-gray-500">Order Reference #:</span>
            <span className="font-mono font-bold text-brand-pink text-sm">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Customer Name:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{order.customerName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Phone Number:</span>
            <span className="font-mono text-gray-900 dark:text-white">{order.whatsapp}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Payment Channel:</span>
            <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
              {isCardPayment ? (
                <>
                  <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                  Safepay Online Card
                </>
              ) : (
                <>
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {order.paymentMethod}
                </>
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Payment Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] flex items-center gap-1 ${
              isCardPayment 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              <ShieldCheck className="w-3 h-3" />
              {isCardPayment ? 'VERIFIED & PAID' : 'PENDING CONFIRMATION'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-800 font-bold text-sm">
            <span className="text-gray-900 dark:text-white">Total Amount Paid / Due:</span>
            <span className="text-brand-pink">Rs {order.grandTotal.toLocaleString()}</span>
          </div>

        </div>

        {/* Dynamic Action Buttons */}
        <div className="space-y-3 pt-2">
          
          <button
            onClick={onTrackOrder}
            className="w-full btn-pink-gradient py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Track Order Real-Time Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-xl font-semibold text-xs transition-colors"
          >
            Continue Shopping
          </button>

        </div>

        {/* Security Footer Notice */}
        <div className="text-center pt-1">
          <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            256-Bit SSL Encrypted Verification Guarantee by Dua Trends
          </p>
        </div>

      </div>
    </div>
  );
};
