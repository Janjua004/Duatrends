import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { categories, setSelectedCategory, setActiveView, showToast } = useStore();

  const handleCategorySelect = (cat: typeof categories[0]) => {
    if (cat.isComingSoon) {
      showToast(`The ${cat.name} collection is coming soon! Stay tuned.`);
      return;
    }
    setSelectedCategory(cat.name);
    setActiveView('shop');
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-pink block mb-1">
              CURATED FOR YOU
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Featured Categories
            </h2>
          </div>
          <button 
            onClick={() => { setSelectedCategory('all'); setActiveView('shop'); }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-pink hover:text-brand-pink-hover group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${
                idx === 0 ? 'col-span-2 sm:col-span-1 lg:col-span-2 aspect-[16/9] sm:aspect-[4/5] lg:aspect-[16/9]' : 'aspect-[4/5]'
              }`}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />

              {/* Coming Soon Badge Overlay */}
              {cat.isComingSoon && (
                <div className="absolute top-3 left-3 z-10 bg-amber-500 text-gray-950 font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg border border-amber-300 flex items-center gap-1">
                  <span>COMING SOON</span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] uppercase tracking-wider text-rose-300 font-semibold block mb-0.5">
                  {cat.isComingSoon ? 'Launching Soon' : `${cat.itemCount} Products`}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold group-hover:text-brand-pink transition-colors">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
