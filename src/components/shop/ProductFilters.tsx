import React from 'react';
import { useStore } from '../../context/StoreContext';
import { RotateCcw, Filter } from 'lucide-react';

interface ProductFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  resetFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  setPriceRange,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  sortBy,
  setSortBy,
  resetFilters
}) => {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  const colorOptions = ["All", "Emerald Green", "Pastel Pink", "Royal Velvet", "Jet Black", "Ivory Gold", "Ruby Red"];
  const sizeOptions = ["All", "Unstitched", "Small", "Medium", "Large", "Custom Tailored"];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-serif font-bold text-lg">
          <Filter className="w-5 h-5 text-brand-pink" />
          <span>Filters</span>
        </div>
        <button 
          onClick={resetFilters}
          className="text-xs font-semibold text-gray-400 hover:text-brand-pink flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Category
        </label>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-left text-xs font-medium px-3 py-2 rounded-xl transition-colors ${
              selectedCategory === 'all'
                ? 'bg-rose-50 text-brand-pink dark:bg-rose-950/40 font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            All Products
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`text-left text-xs font-medium px-3 py-2 rounded-xl transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-rose-50 text-brand-pink dark:bg-rose-950/40 font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          <span>Max Price:</span>
          <span className="text-brand-pink">Rs {priceRange[1].toLocaleString()}</span>
        </div>
        <input 
          type="range"
          min={1500}
          max={25000}
          step={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-pink cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>Rs 1,500</span>
          <span>Rs 25,000+</span>
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
          Color
        </label>
        <div className="flex flex-wrap gap-1.5">
          {colorOptions.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                selectedColor === color
                  ? 'border-brand-pink bg-rose-50 text-brand-pink dark:bg-rose-950/40 font-bold'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
          Size
        </label>
        <div className="flex flex-wrap gap-1.5">
          {sizeOptions.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                selectedSize === size
                  ? 'border-brand-pink bg-rose-50 text-brand-pink dark:bg-rose-950/40 font-bold'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2 border-t border-gray-100 dark:border-gray-800 pt-4">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-brand-pink text-gray-800 dark:text-white"
        >
          <option value="popular">Most Popular (Clicks)</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};
