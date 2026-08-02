import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, ShoppingBag, Heart, Search, PackageCheck } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, cart, wishlist } = useStore();
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-2 py-2 flex items-center justify-around shadow-2xl">
      <button 
        onClick={() => setActiveView('home')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors ${activeView === 'home' ? 'text-brand-pink font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button 
        onClick={() => setActiveView('shop')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors ${activeView === 'shop' ? 'text-brand-pink font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Search className="w-5 h-5" />
        <span>Shop</span>
      </button>

      <button 
        onClick={() => setActiveView('cart')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors relative ${activeView === 'cart' ? 'text-brand-pink font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Cart</span>
        {totalCartItems > 0 && (
          <span className="absolute top-1 right-2 bg-brand-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {totalCartItems}
          </span>
        )}
      </button>

      <button 
        onClick={() => setActiveView('wishlist')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors relative ${activeView === 'wishlist' ? 'text-brand-pink font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Heart className="w-5 h-5" />
        <span>Wishlist</span>
        {wishlist.length > 0 && (
          <span className="absolute top-1 right-2 bg-brand-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </button>

      <button 
        onClick={() => setActiveView('track')}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-colors ${activeView === 'track' ? 'text-brand-pink font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <PackageCheck className="w-5 h-5" />
        <span>Track</span>
      </button>
    </div>
  );
};
