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
  Sparkles,
  User as UserIcon
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
    setSelectedCategory,
    currentUser,
    isCustomerLoggedIn,
    setShowAuthModal,
    setAuthModalMode
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
      <div className="bg-red-600 text-white text-[11px] font-bold py-2 px-4 text-center tracking-wider uppercase flex items-center justify-between overflow-hidden">
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>DUA TRENDS LUXURY EDITION</span>
        </div>

        <p className="flex-1 min-w-0 truncate mx-2 text-center">
          FLAT 25% OFF ON ALL UNSTITCHED SUITS | 25% ADVANCE DOWNPAYMENT AVAILABLE
        </p>

        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <span className="font-mono text-[10px] text-amber-200 uppercase tracking-widest">DUA TRENDS OFFICIAL</span>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Mobile Header Layout (< lg) */}
        <div className="lg:hidden grid grid-cols-3 items-center h-16 sm:h-20">
          {/* Mobile Left: Hamburger Menu */}
          <div className="flex items-center justify-start">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-800 dark:text-gray-200 hover:text-brand-pink transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Center: Logo centered with exact crown-top border alignment */}
          <div className="flex items-center justify-center py-1">
            <button 
              onClick={() => setActiveView('home')} 
              className="flex items-center justify-center focus:outline-none py-0.5 group"
            >
              <img 
                src="/logo.png" 
                alt="Dua Trends Logo" 
                className="h-14 sm:h-16 md:h-18 w-auto object-contain dark:brightness-110 scale-110 sm:scale-115 transition-transform group-hover:scale-120 drop-shadow-sm"
                onError={(e) => {
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="font-serif text-2xl font-bold tracking-wider text-gray-950 dark:text-white uppercase">Dua <span class="text-rose-600">Trends</span></span>`;
                  }
                }}
              />
            </button>
          </div>

          {/* Mobile Right: Customer Account & Dark Mode Switcher */}
          <div className="flex items-center justify-end gap-1.5">
            <button 
              onClick={() => setActiveView(isCustomerLoggedIn ? 'account' : 'login')}
              className="p-1.5 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Header Layout (>= lg) */}
        <div className="hidden lg:flex items-center justify-between gap-6 h-24">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('home')} 
              className="flex items-center group focus:outline-none py-1"
            >
              <div className="h-20 w-auto max-w-[340px] flex items-center justify-start">
                <img 
                  src="/logo.png" 
                  alt="Dua Trends - Luxury Pakistani Unstitched Lawn & Designer Formal Wear Collection Logo" 
                  loading="eager"
                  decoding="async"
                  className="h-full w-auto object-contain dark:brightness-110 scale-105 transition-transform group-hover:scale-110 drop-shadow-sm"
                  onError={(e) => {
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="font-serif text-3xl font-bold tracking-wider text-gray-950 dark:text-white uppercase">Dua <span class="text-rose-600">Trends</span></span>`;
                    }
                  }}
                />
              </div>
            </button>
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex items-center gap-6 text-xs uppercase tracking-widest font-bold text-gray-800 dark:text-gray-200">
            <button 
              onClick={() => setActiveView('home')} 
              className={`hover:text-brand-pink transition-colors py-1 ${
                activeView === 'home' ? 'text-brand-pink border-b-2 border-brand-pink' : ''
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => { setSelectedCategory('Casual Wear'); setActiveView('shop'); }} 
              className={`hover:text-brand-pink transition-colors py-1 ${
                activeView === 'shop' ? 'text-brand-pink border-b-2 border-brand-pink' : ''
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
            <button 
              onClick={() => setActiveView('track')} 
              className="hover:text-brand-pink transition-colors py-1"
            >
              Track Order
            </button>
          </nav>

          {/* Right: Search, Customer Account, Wishlist, Cart & Theme */}
          <div className="flex items-center gap-3">
            
            {/* Fixed Search Bar with Clean Border */}
            <form onSubmit={handleSearchSubmit} className="flex items-center relative w-44">
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

            {/* Customer Account Button */}
            {isCustomerLoggedIn ? (
              <button
                onClick={() => setActiveView('account')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                  activeView === 'account'
                    ? 'bg-brand-pink text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200'
                }`}
                title="My Account"
              >
                <UserIcon className="w-3.5 h-3.5 text-brand-pink" />
                <span className="truncate max-w-[80px]">{currentUser?.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('login')}
                className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-brand-pink hover:text-white transition-all shadow-sm"
                title="Sign In / Register"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

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
