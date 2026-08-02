import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    flatShippingFee,
    freeShippingLimit,
    setActiveView 
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const shipping = subtotal >= freeShippingLimit ? 0 : flatShippingFee;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const amountNeededForFreeShipping = Math.max(0, freeShippingLimit - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingLimit) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput) {
      applyCoupon(couponCodeInput);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4 px-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 text-brand-pink mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500">Discover our luxury ladies fashion collections to add your favorite items.</p>
        <button onClick={() => setActiveView('shop')} className="btn-pink-gradient py-3.5 px-8 rounded-2xl font-bold text-sm shadow-lg">
          Explore Fashion Store
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Your Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-1">{cart.reduce((s, i) => s + i.quantity, 0)} items in your cart</p>
        </div>

        <button 
          onClick={clearCart} 
          className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900 space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-gray-800 dark:text-gray-200">
            {amountNeededForFreeShipping === 0 
              ? '🎉 Congratulations! You have unlocked FREE Nationwide Delivery!' 
              : `Add Rs ${amountNeededForFreeShipping.toLocaleString()} more for FREE Delivery!`}
          </span>
          <span className="text-brand-pink">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="bg-brand-pink h-full transition-all duration-500" style={{ width: `${freeShippingProgress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Cart Item Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {cart.map((item, index) => (
                <div key={index} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  
                  {/* Left info */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.title} 
                      className="w-20 h-24 object-cover rounded-2xl bg-gray-100 dark:bg-gray-800"
                    />
                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">
                        {item.product.title}
                      </h3>
                      <div className="text-xs text-gray-500 space-x-2">
                        <span>Color: <strong className="text-gray-700 dark:text-gray-300">{item.selectedColor}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-gray-700 dark:text-gray-300">{item.selectedSize}</strong></span>
                      </div>
                      <span className="text-sm font-bold text-brand-pink block">
                        Rs {item.product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Right actions: Qty controls & delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-base text-gray-900 dark:text-white">
                      Rs {(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    <button 
                      onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveView('shop')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-pink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">
              Cart Summary
            </h3>

            {/* Coupon Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-brand-pink" />
                Promo / Coupon Code
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-200">
                  <span>Code '{appliedCoupon.code}' Applied!</span>
                  <button onClick={removeCoupon} className="text-rose-500 underline">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. STYLE10"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white uppercase font-mono"
                  />
                  <button type="submit" className="px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-xl text-xs font-semibold hover:bg-brand-pink transition-colors">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Breakdown */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">Rs {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>- Rs {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    `Rs ${shipping.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-brand-pink">Rs {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Sticky Checkout CTA */}
            <button
              onClick={() => setActiveView('checkout')}
              className="w-full btn-pink-gradient py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Instant WhatsApp Order Confirmation</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
