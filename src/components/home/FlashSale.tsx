import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../shop/ProductCard';
import { Flame, Clock } from 'lucide-react';

export const FlashSale: React.FC = () => {
  const { products, setActiveView } = useStore();

  // 24 hour countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const offerProducts = products.filter(p => p.isOffer || (p.compareAtPrice && p.compareAtPrice > p.price)).slice(0, 4);

  return (
    <section className="py-16 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Promotional Offer Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl bg-gradient-to-r from-rose-900 via-gray-900 to-gray-950 text-white min-h-[300px] flex items-center">
          <img 
            src="/images/offer_banner.jpg" 
            alt="Dua Trends Flash Sale" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="relative z-10 p-8 sm:p-12 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-widest">
              <Flame className="w-4 h-4 text-brand-pink fill-brand-pink animate-bounce" />
              <span>LIMITED TIME FLASH SALE</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Flat 25% OFF on Luxury Silk & Lawn Sets
            </h3>

            {/* Countdown timer UI */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-4 h-4 text-brand-pink" />
                Ends In:
              </span>
              <div className="flex items-center gap-2 text-center font-mono">
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                  <span className="text-xl font-bold text-white block">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">HRS</span>
                </div>
                <span className="text-brand-pink font-bold text-lg">:</span>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                  <span className="text-xl font-bold text-white block">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">MIN</span>
                </div>
                <span className="text-brand-pink font-bold text-lg">:</span>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                  <span className="text-xl font-bold text-white block">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">SEC</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setActiveView('offers')}
                className="btn-pink-gradient px-6 py-3 rounded-xl font-semibold text-sm shadow-lg"
              >
                Claim Flash Sale Discount
              </button>
            </div>
          </div>
        </div>

        {/* Offer Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              Today's Special Offers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
