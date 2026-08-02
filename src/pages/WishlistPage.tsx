import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/shop/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { products, wishlist, setActiveView } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4 px-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 text-brand-pink mx-auto flex items-center justify-center">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Your Wishlist is Empty</h2>
        <p className="text-sm text-gray-500">Save items you love by tapping the heart icon on any outfit.</p>
        <button onClick={() => setActiveView('shop')} className="btn-pink-gradient py-3.5 px-8 rounded-2xl font-bold text-sm shadow-lg">
          Explore Fashion Collections
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Saved Wishlist</h1>
        <p className="text-xs text-gray-500 mt-1">{wishlistedProducts.length} items saved for later</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
