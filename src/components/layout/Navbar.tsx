import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Lock,
  Unlock,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    cart, 
    wishlist, 
    darkMode, 
    setDarkMode, 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery,
    announcementText,
    whatsappNumber,
    isAdminLoggedIn,
    setShowAdminLoginModal,
    setSelectedCategory
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('shop');
    }
  };

  const handleAdminAccess = () => {
    if (isAdminLoggedIn) {
      setActiveView(activeView === 'admin' ? 'home' : 'admin');
    } else {
      setShowAdminLoginModal(true);
    }
  };

  return (
    <header className="relative z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors shadow-sm">
      
      {/* Red Announcement Ticker */}
      <div className="bg-red-600 text-white text-[11px] font-bold py-2 px-4 text-center tracking-wider uppercase flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>STYLEWING LUXURY EDITION</span>
        </div>

        <p className="flex-1 truncate mx-2">
          FLAT 25% OFF ON ALL UNSTITCHED SUITS | 25% ADVANCE DOWNPAYMENT AVAILABLE
        </p>

        <div className="hidden md:flex items-center gap-3">
          <a 
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 hover:underline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{whatsappNumber}</span>
          </a>
        </div>
      </div>

      {/* Main Clean Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Navigation Links */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-800 dark:text-gray-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-semibold text-gray-800 dark:text-gray-200">
            <button 
              onClick={() => setActiveView('home')} 
              className={`hover:text-brand-pink transition-colors py-1 ${
                activeView === 'home' ? 'text-brand-pink font-bold border-b-2 border-brand-pink' : ''
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => { setSelectedCategory('Casual Wear'); setActiveView('shop'); }} 
              className={`hover:text-brand-pink transition-colors py-1 ${
                activeView === 'shop' ? 'text-brand-pink font-bold border-b-2 border-brand-pink' : ''
              }`}
            >
              Unstitched
            </button>
            <button 
              onClick={() => { setSelectedCategory('Party Wear'); setActiveView('shop'); }} 
              className="hover:text-brand-pink transition-colors py-1"
            >
              Formals
            </button>
            <button 
              onClick={() => setActiveView('offers')} 
              className="text-red-600 font-bold hover:underline py-1"
            >
              Sale -25%
            </button>
          </nav>
        </div>

        {/* Center: Brand Title (StyleWing style) */}
        <button 
          onClick={() => setActiveView('home')} 
          className="text-center group focus:outline-none"
        >
          <span className="font-serif text-3xl md:text-4xl font-bold tracking-wider text-gray-950 dark:text-white uppercase block leading-none">
            Style<span className="text-brand-pink">Wing</span>
          </span>
          <span className="text-[9px] tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 uppercase block mt-1">
            HAUTE COUTURE FASHION HOUSE
          </span>
        </button>

        {/* Right: Search, Admin Login, Wishlist, Cart & Theme */}
        <div className="flex items-center gap-3">
          
          {/* Fixed Search Bar with Clean Border */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-48">
            <div className="w-full flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 focus-within:border-brand-pink focus-within:ring-1 focus-within:ring-brand-pink transition-all">
              <Search className="w-3.5 h-3.5 text-gray-400 mr-2 flex-shrink-0" />
              <input 
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-900 dark:text-white uppercase tracking-wider focus:outline-none placeholder-gray-400"
              />
            </div>
          </form>

          {/* Login Button */}
          <button
            onClick={handleAdminAccess}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              activeView === 'admin'
                ? 'bg-emerald-600 text-white'
                : isAdminLoggedIn
                ? 'bg-brand-pink text-white hover:bg-brand-pink-hover'
                : 'bg-gray-950 dark:bg-gray-900 text-white hover:bg-brand-pink border border-gray-800'
            }`}
            title="Login to Store Dashboard"
          >
            {isAdminLoggedIn ? <Unlock className="w-3.5 h-3.5 text-emerald-300" /> : <Lock className="w-3.5 h-3.5 text-rose-300" />}
            <span className="hidden sm:inline">
              {activeView === 'admin' ? 'Storefront' : isAdminLoggedIn ? 'Dashboard' : 'Login'}
            </span>
          </button>

          {/* Dark / Light Mode Switcher */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Icon */}
          <button 
            onClick={() => setActiveView('wishlist')}
            className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 hover:text-brand-pink" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-pink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button 
            onClick={() => setActiveView('cart')}
            className="p-2 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative flex items-center gap-1"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-4 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <div className="w-full flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text"
                placeholder="SEARCH PRODUCTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-900 dark:text-white uppercase tracking-wider focus:outline-none"
              />
            </div>
          </form>

          <div className="flex flex-col gap-2 font-semibold text-xs uppercase tracking-wider">
            <button onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }} className="text-left py-2 border-b dark:border-gray-800">
              Home
            </button>
            <button onClick={() => { setSelectedCategory('Casual Wear'); setActiveView('shop'); setMobileMenuOpen(false); }} className="text-left py-2 border-b dark:border-gray-800">
              Unstitched Collection
            </button>
            <button onClick={() => { setSelectedCategory('Party Wear'); setActiveView('shop'); setMobileMenuOpen(false); }} className="text-left py-2 border-b dark:border-gray-800">
              Formals & Party Wear
            </button>
            <button onClick={() => { setActiveView('offers'); setMobileMenuOpen(false); }} className="text-left py-2 text-red-600 font-bold border-b dark:border-gray-800">
              Special Sale -25%
            </button>
            <button onClick={() => { setActiveView('track'); setMobileMenuOpen(false); }} className="text-left py-2 border-b dark:border-gray-800">
              Track Order
            </button>
            <button onClick={() => { handleAdminAccess(); setMobileMenuOpen(false); }} className="text-left py-2 text-emerald-600 font-bold flex justify-between">
              <span>Login</span>
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
