import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-brand-pink">OUR HERITAGE</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          About StyleWing
        </h1>
        <p className="text-base text-gray-500 max-w-2xl mx-auto">
          "Elegance in Every Style" – Redefining luxury ladies' fashion in Pakistan with unmatched craftsmanship and timeless silhouettes.
        </p>
      </div>

      <div className="relative aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src="/images/hero_banner.jpg" 
          alt="StyleWing Fashion Studio" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 leading-relaxed text-gray-700 dark:text-gray-300">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">The Brand Story</h2>
          <p className="text-sm">
            Founded with a vision to celebrate feminine elegance, StyleWing brings together high-fashion aesthetics, premium cotton lawn fabrics, pure silk chiffons, and intricate hand embroidery tailored for modern women across Pakistan.
          </p>
          <p className="text-sm">
            From regal unstitched festive collections to effortless ready-to-wear prêt outfits, every garment is designed to make a statement of luxury and poise.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Our Promise</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
              <span><strong>100% Authentic Quality:</strong> Premium grade dyes, breathable summer fabrics, and durable stitching.</span>
            </li>
            <li className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
              <span><strong>Customer First:</strong> Instant WhatsApp ordering with zero hassle COD delivery nationwide.</span>
            </li>
            <li className="flex items-start gap-3">
              <Award className="w-5 h-5 text-brand-pink flex-shrink-0 mt-0.5" />
              <span><strong>Hassle-Free Exchange:</strong> 7-day complete return & exchange policy.</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
};
