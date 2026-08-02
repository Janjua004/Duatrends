import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProductForModal, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    trackProductClick,
    setActiveView
  } = useStore();

  const isWishlisted = isInWishlist(product.id);

  const handleCardClick = () => {
    trackProductClick(product.id);
    setSelectedProductForModal(product);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackProductClick(product.id);
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 20;

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image container - StyleWing aspect-[2/3] extra tall portrait ratio */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Hover secondary image */}
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={product.title} 
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            loading="lazy"
          />
        )}

        {/* Red Sale Tag or OUT OF STOCK Badge */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.stock <= 0 ? (
            <div className="bg-gray-900 text-white font-bold text-[10px] px-2 py-1 shadow-md flex items-center justify-center uppercase tracking-wider">
              OUT OF STOCK
            </div>
          ) : (
            <div className="bg-red-600 text-white font-bold text-[11px] px-2 py-1 shadow-md flex items-center justify-center uppercase tracking-widest">
              -{discountPercent}%
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:text-brand-pink transition-all shadow"
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-brand-pink text-brand-pink' : ''}`} />
        </button>

        {/* Quick View overlay */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
            className="flex-1 bg-gray-900/90 dark:bg-white/90 hover:bg-black text-white dark:text-gray-900 py-2 px-2 rounded text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button 
            onClick={handleQuickAdd}
            className="bg-brand-pink hover:bg-brand-pink-hover text-white p-2 rounded shadow-md flex items-center justify-center"
            title="Add to Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content - StyleWing exact text formatting */}
      <div className="p-3 text-center space-y-1 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500 block">
            UNSTITCHED 3 PC
          </span>
          
          <h3 className="font-serif text-xs sm:text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 uppercase tracking-wide group-hover:text-brand-pink transition-colors mt-0.5">
            {product.title}
          </h3>
        </div>

        {/* Price in PKR */}
        <div className="pt-1 flex items-center justify-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-mono">
            PKR {product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[11px] text-gray-400 line-through font-mono">
              PKR {product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
