import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, PackageCheck, Truck, CheckCircle2, Clock, MapPin, MessageCircle } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, whatsappNumber } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<typeof orders[0] | null>(orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      o => o.orderNumber.toLowerCase() === query.trim().toLowerCase() || o.phone.includes(query.trim())
    );
    setSearchedOrder(found || null);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Packed': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest text-brand-pink">
          REAL-TIME DISPATCH UPDATES
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Track Your StyleWing Parcel
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Enter your Order Number (e.g. SW-9821) or phone number to check status.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Enter Order # (e.g. SW-9821)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:border-brand-pink text-gray-900 dark:text-white shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
        <button type="submit" className="btn-pink-gradient px-6 py-3 rounded-2xl font-bold text-sm shadow-md">
          Track Order
        </button>
      </form>

      {/* Order Status Display */}
      {searchedOrder ? (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl space-y-8 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6 gap-4">
            <div>
              <span className="text-xs text-gray-400 uppercase font-semibold">Order Number</span>
              <h3 className="font-mono text-2xl font-bold text-brand-pink">{searchedOrder.orderNumber}</h3>
              <p className="text-xs text-gray-500 mt-1">Placed on {new Date(searchedOrder.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 uppercase font-semibold">Total Amount</span>
              <p className="text-xl font-bold text-gray-900 dark:text-white">Rs {searchedOrder.grandTotal.toLocaleString()}</p>
              <span className="text-xs font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full inline-block mt-1">
                {searchedOrder.paymentMethod}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Delivery Progress: <span className="text-brand-pink font-extrabold">{searchedOrder.status}</span>
            </h4>

            <div className="relative pt-4">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-100 dark:bg-gray-800">
                <div 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-pink transition-all duration-700" 
                  style={{ width: `${(getStepIndex(searchedOrder.status) / 5) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-5 text-center text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                <div className={getStepIndex(searchedOrder.status) >= 1 ? 'text-brand-pink font-bold' : ''}>1. Pending</div>
                <div className={getStepIndex(searchedOrder.status) >= 2 ? 'text-brand-pink font-bold' : ''}>2. Confirmed</div>
                <div className={getStepIndex(searchedOrder.status) >= 3 ? 'text-brand-pink font-bold' : ''}>3. Packed</div>
                <div className={getStepIndex(searchedOrder.status) >= 4 ? 'text-brand-pink font-bold' : ''}>4. Shipped</div>
                <div className={getStepIndex(searchedOrder.status) >= 5 ? 'text-brand-pink font-bold' : ''}>5. Delivered</div>
              </div>
            </div>
          </div>

          {/* Items ordered preview */}
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Items in this Parcel:
            </h4>
            <div className="space-y-2">
              {searchedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-8 h-10 object-cover rounded" />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white block">{item.title}</span>
                      <span className="text-gray-400">{item.color} | {item.size}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {item.quantity} x Rs {item.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">Need urgent update regarding this shipment?</span>
            <a 
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello StyleWing! Inquiry for Order ${searchedOrder.orderNumber}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Ask on WhatsApp
            </a>
          </div>

        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 text-sm">
          No order found matching your search. Try searching for <strong>SW-9821</strong> or <strong>SW-9822</strong>.
        </div>
      )}

    </div>
  );
};
