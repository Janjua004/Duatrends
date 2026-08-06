import React from 'react';
import { ShieldCheck, Truck, Banknote, RefreshCw, MessageSquare } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Premium Quality',
      desc: '100% authentic luxury lawn, silk chiffon & organza fabrics with high grade embroidery.'
    },
    {
      icon: Truck,
      title: 'Fast Nationwide Shipping',
      desc: 'Quick dispatch with 2-4 working days delivery across all major cities of Pakistan.'
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      desc: 'Pay at your doorstep with complete ease and zero advance risk.'
    },
    {
      icon: RefreshCw,
      title: 'Hassle-Free Exchange',
      desc: '7-day seamless size or item exchange for absolute customer satisfaction.'
    },
    {
      icon: MessageSquare,
      title: 'Direct WhatsApp Checkout',
      desc: 'Place orders instantly without passwords or complex payment forms.'
    }
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-pink">
            THE DUA TRENDS ADVANTAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Why Choose Dua Trends?
          </h2>
          <p className="text-sm text-gray-400">
            We deliver pure luxury and unparalleled elegance straight to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-gray-800/60 border border-gray-700/50 hover:border-brand-pink transition-all duration-300 space-y-3 text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-900 mx-auto flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
