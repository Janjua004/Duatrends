import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentOption } from '../../types';
import { ShoppingBag, ArrowLeft, MessageCircle, Tag, ShieldCheck, Percent, Banknote, Building2 } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    cart, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    flatShippingFee, 
    freeShippingLimit, 
    placeOrder, 
    whatsappNumber,
    setActiveView 
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [country] = useState('Pakistan');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption>('25% Advance Downpayment');
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

  // Downpayment & COD calculation
  const downpayment25Amount = Math.round((grandTotal * 25) / 100);
  const remainingCodAmount = grandTotal - downpayment25Amount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput) {
      applyCoupon(couponCodeInput);
    }
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address || !city) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    const orderObj = placeOrder({
      customerName,
      phone,
      whatsapp: whatsapp || phone,
      email,
      address,
      city,
      province,
      postalCode,
      country,
      specialNotes,
      paymentMethod
    });

    // Auto open WhatsApp with preformatted order
    const targetNum = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(orderObj.formattedWhatsAppMsg);
    window.open(`https://wa.me/${targetNum}?text=${encodedMsg}`, '_blank');

    setActiveView('track');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-brand-pink mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500">Explore our luxury fashion collections to add items.</p>
        <button onClick={() => setActiveView('shop')} className="btn-pink-gradient py-3 px-6 rounded-xl font-semibold text-sm">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back button */}
      <button 
        onClick={() => setActiveView('cart')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-pink mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shopping Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Customer Information Form */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handlePlaceOrderSubmit} className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                Checkout & Shipping Details
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Order will be placed directly to our WhatsApp store with payment option details.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300">
                1. Customer & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Customer Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sara Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Number (If different)
                  </label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 03001234567"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input 
                    type="email" 
                    placeholder="sara@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300">
                2. Delivery Destination
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Street Address & House / Apartment # *
                </label>
                <textarea 
                  required
                  rows={2}
                  placeholder="e.g. House 22, Street 5, Johar Town"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Lahore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Province *
                  </label>
                  <select 
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad Capital">Islamabad Capital</option>
                    <option value="AJK">Azad Kashmir</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input 
                    type="text" 
                    placeholder="54000"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Special Instructions / Note
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Deliver after 5 PM"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl dark:border-gray-700 dark:text-white focus:outline-none focus:border-brand-pink"
                />
              </div>
            </div>

            {/* Payment Method Options (including 25% downpayment and 100% payment) */}
            <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  3. Select Payment Option
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose advance downpayment or full payment terms for your WhatsApp order
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 25% Advance Downpayment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('25% Advance Downpayment')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                    paymentMethod === '25% Advance Downpayment'
                      ? 'border-brand-pink bg-rose-50 dark:bg-rose-950/40 text-brand-pink font-bold shadow-md'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-brand-pink" />
                      25% Downpayment
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-brand-pink text-white px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 space-y-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white">Pay Rs {downpayment25Amount.toLocaleString()} upfront</p>
                    <p>Remaining 75% (Rs {remainingCodAmount.toLocaleString()}) on Delivery (COD)</p>
                  </div>
                </button>

                {/* 100% Full Advance Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('100% Full Payment')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === '100% Full Payment'
                      ? 'border-brand-pink bg-rose-50 dark:bg-rose-950/40 text-brand-pink font-bold shadow-md'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-500" />
                      100% Full Payment
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      EXPRESS
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 space-y-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white">Pay Rs {grandTotal.toLocaleString()} full amount</p>
                    <p>Priority processing & fast dispatch</p>
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-brand-pink bg-rose-50 dark:bg-rose-950/40 text-brand-pink font-bold shadow-md'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold flex items-center gap-1.5">
                    <Banknote className="w-4 h-4" />
                    Standard Cash on Delivery
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 block">
                    Pay 100% at doorstep upon parcel arrival
                  </span>
                </button>

                {/* Boutique Pickup */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Boutique Pickup')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'Boutique Pickup'
                      ? 'border-brand-pink bg-rose-50 dark:bg-rose-950/40 text-brand-pink font-bold shadow-md'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold">Boutique Pickup</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 block">
                    Pay & collect at Gulberg III Flagship Store
                  </span>
                </button>

              </div>
            </div>

            {/* Submit Order */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-3 shadow-xl transition-transform hover:scale-[1.01]"
            >
              <MessageCircle className="w-6 h-6 animate-pulse" />
              <span>Place Order via WhatsApp</span>
            </button>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">
              Order Summary ({cart.length} items)
            </h3>

            {/* Cart Item list */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.title} 
                    className="w-16 h-20 object-cover rounded-xl bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Color: {item.selectedColor} | Size: {item.selectedSize}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity} x Rs {item.product.price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    Rs {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
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
                    placeholder="Try STYLE10"
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

            {/* Financial Breakdown */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">Rs {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span>- Rs {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    `Rs ${shipping.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-brand-pink">Rs {grandTotal.toLocaleString()}</span>
              </div>

              {/* Dynamic Downpayment Breakdown Box */}
              {paymentMethod === '25% Advance Downpayment' && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-brand-pink">
                    <span>▶ 25% Advance Payment:</span>
                    <span>Rs {downpayment25Amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>▶ 75% Remaining COD:</span>
                    <span className="font-semibold">Rs {remainingCodAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 pt-1 border-t border-rose-200/50">
                    * Details for transferring 25% advance (Bank/JazzCash) will be sent on WhatsApp.
                  </p>
                </div>
              )}

              {paymentMethod === '100% Full Payment' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900 text-xs space-y-1 font-bold text-emerald-700 dark:text-emerald-300">
                  <div className="flex justify-between">
                    <span>▶ 100% Full Advance Payment:</span>
                    <span>Rs {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
              <p>
                Clicking <strong>Place Order via WhatsApp</strong> opens WhatsApp with your full order & payment breakdown pre-formatted.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
