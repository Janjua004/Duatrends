import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductFilters } from '../components/shop/ProductFilters';
import { Search, SlidersHorizontal } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, selectedCategory, searchQuery, setSearchQuery } = useStore();

  const [priceRange, setPriceRange] = useState<[number, number]>([1500, 25000]);
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const resetFilters = () => {
    setPriceRange([1500, 25000]);
    setSelectedColor('All');
    setSelectedSize('All');
    setSortBy('popular');
    setSearchQuery('');
  };

  // Filtering Logic
  let filtered = products.filter(product => {
    // Category
    if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Search
    if (searchQuery.trim() && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) && !product.sku.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Price
    if (product.price > priceRange[1]) {
      return false;
    }
    // Color
    if (selectedColor !== 'All' && product.colors && !product.colors.includes(selectedColor)) {
      return false;
    }
    // Size
    if (selectedSize !== 'All' && product.sizes && !product.sizes.includes(selectedSize)) {
      return false;
    }
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.clicks || 0) - (a.clicks || 0); // popular
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {selectedCategory === 'all' ? 'All Fashion Collections' : selectedCategory}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing <span className="font-bold text-brand-pink">{filtered.length}</span> luxury ladies items
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-semibold text-gray-800 dark:text-white"
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-pink" />
          <span>{showMobileFilters ? 'Hide Filters' : 'Filter Products'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filter Sidebar */}
        <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'}`}>
          <ProductFilters 
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resetFilters={resetFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          {filtered.length === 0 ? (
            <div className="py-16 text-center bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
              <Search className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">No Products Found</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">Try adjusting your filters or price range to find matching outfits.</p>
              <button onClick={resetFilters} className="btn-pink-gradient px-4 py-2 rounded-xl text-xs font-bold">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
