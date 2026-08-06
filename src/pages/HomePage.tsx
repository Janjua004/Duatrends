import React from 'react';
import { useStore } from '../context/StoreContext';
import { Hero } from '../components/home/Hero';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { ProductCard } from '../components/shop/ProductCard';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { InstagramFeed } from '../components/home/InstagramFeed';
import { ArrowRight, Flame } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, setActiveView, setSelectedCategory } = useStore();

  const unstitchedProducts = products.filter(p => p.category.toLowerCase().includes('unstitched') || p.isFeatured).slice(0, 8);
  const partyWearProducts = products.filter(p => p.category.toLowerCase().includes('party') || p.isTrending).slice(0, 4);
  const formalProducts = products.filter(p => p.category.toLowerCase().includes('formal') || p.isOffer).slice(0, 4);

  return (
    <div className="space-y-16">
      
      {/* Hero Banner */}
      <Hero />

      {/* TOP SECTION 1: Unstitched Luxury Lawn Collection (Moved to Top Place) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-brand-pink block">
            LIMITED EDITION 2026
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase text-gray-900 dark:text-white tracking-wide">
            Unstitched Luxury Collection
          </h2>
          <div className="w-16 h-0.5 bg-brand-pink mx-auto" />
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {unstitchedProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {unstitchedProducts.slice(4, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-4">
          <button 
            onClick={() => { setSelectedCategory('Casual Wear'); setActiveView('shop'); }}
            className="btn-pink-gradient px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg inline-flex items-center gap-2"
          >
            <span>Explore Full Unstitched Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 2: Party Wear & Formal Suits (4-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-brand-pink block">
            ELEGANT COUTURE
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase text-gray-900 dark:text-white tracking-wide">
            Party Wear & Formals
          </h2>
          <div className="w-16 h-0.5 bg-brand-pink mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {partyWearProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Spotlight Section - Full Width Corner to Corner */}
      <section className="w-full bg-gray-950 text-white overflow-hidden shadow-2xl">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-7 p-8 md:p-14 lg:p-20 space-y-6 max-w-3xl justify-self-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-400 text-xs font-bold uppercase tracking-widest">
              <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>DUA TRENDS FEATURED SPOTLIGHT</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight uppercase tracking-wide">
              Festive Chiffon & Silk Formal Edition
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
              Intricate zardozi threadwork, gold zari embroidery, and pure silk chiffons designed for high-end formal wear and wedding festivities.
            </p>

            <button 
              onClick={() => setActiveView('offers')}
              className="btn-pink-gradient px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl inline-flex items-center gap-2 transition-transform hover:scale-105"
            >
              <span>Shop Festive Formal Edition</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 h-full min-h-[420px]">
            <img 
              src="/images/collection_banner.jpg" 
              alt="Dua Trends Festive Collection" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* SECTION 3: Summer & Winter prêt (4-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-brand-pink block">
            HOT SELLING ARTICLES
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold uppercase text-gray-900 dark:text-white tracking-wide">
            Special Sale & Offers
          </h2>
          <div className="w-16 h-0.5 bg-brand-pink mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {formalProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Featured Categories Grid */}
      <section className="pt-4">
        <CategoriesSection />
      </section>

      {/* Customer Reviews (Placed directly ABOVE Instagram Feed at bottom of page) */}
      <CustomerReviewsSection />

      {/* Instagram Wall */}
      <InstagramFeed />

    </div>
  );
};
