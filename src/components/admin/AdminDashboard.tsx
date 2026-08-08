import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductManager } from './ProductManager';
import { OrderManager } from './OrderManager';
import { AnalyticsManager } from './AnalyticsManager';
import { CouponManager } from './CouponManager';
import { ReviewManager } from './ReviewManager';
import { CMSSettings } from './CMSSettings';
import { CategoryManager } from './CategoryManager';
import { UserManager } from './UserManager';
import { AdminLoginModal } from './AdminLoginModal';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  MessageCircle, 
  DollarSign, 
  Tag, 
  Star, 
  Settings, 
  Sun, 
  Moon, 
  ArrowUpRight,
  MousePointerClick,
  Lock,
  Layers,
  UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    activeAdminTab, 
    setActiveAdminTab,
    darkMode,
    setDarkMode,
    setActiveView,
    logoutAdmin,
    isAdminLoggedIn
  } = useStore();

  if (!isAdminLoggedIn) {
    return <AdminLoginModal />;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalWhatsAppOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalClicks = products.reduce((sum, p) => sum + (p.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-poppins transition-colors duration-200">
      
      {/* Admin Top Navbar (Supports Light & Dark Modes) */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-pink flex items-center justify-center font-bold text-white shadow-lg">
            DT
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-gray-900 dark:text-white leading-tight">
              Dua Trends Admin Control Panel
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Real-Time E-Commerce Management & Supabase Database Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('home')}
            className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-1.5"
          >
            <span>Exit to Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800/40 text-xs font-semibold text-rose-600 dark:text-rose-300 transition-colors flex items-center gap-1.5"
            title="Log Out Admin Session"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-950/80 border-r border-gray-200 dark:border-gray-800 p-4 space-y-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveAdminTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'dashboard'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'categories'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Category Manager</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'products'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Product Manager</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'orders'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Invoices</span>
            </div>
            {pendingOrders > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold animate-pulse">
                {pendingOrders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'users'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Registered Users (Supabase)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'analytics'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MousePointerClick className="w-4 h-4" />
            <span>Click Analytics & Heatmap</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'coupons'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupon Codes</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'reviews'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews Moderation</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('cms')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'cms'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store CMS & Security</span>
          </button>
        </aside>

        {/* Main Content Area (Light & Dark Mode compatible) */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Rs {totalRevenue.toLocaleString()}</h3>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Live verified transactions</span>
                </div>

                <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Customer Orders</span>
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalWhatsAppOrders}</h3>
                  <span className="text-[11px] text-rose-500 font-semibold">{pendingOrders} Pending confirmation</span>
                </div>

                <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-brand-pink" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</h3>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">Active catalog items</span>
                </div>

                <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Product Clicks Tracked</span>
                    <MousePointerClick className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalClicks}</h3>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Live interaction analytics</span>
                </div>

              </div>

              {/* Graphical Overview Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sales Volume */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Sales & Orders Volume</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-full font-semibold">
                      Real-Time Supabase Sync
                    </span>
                  </div>

                  <div className="h-56 flex items-end gap-3 pt-6 px-2">
                    {[65, 80, 45, 95, 120, 110, 140].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-brand-pink/20 to-brand-pink rounded-t-xl transition-all duration-500 hover:opacity-80"
                          style={{ height: `${(val / 150) * 100}%` }}
                        />
                        <span className="text-[10px] text-gray-400 font-mono">Day {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Categories Widget */}
                <div className="bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Top Categories</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <span>Unstitched Lawn</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-pink h-full w-[42%]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <span>Silk Chiffon Formal</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[28%]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300">
                        <span>Casual Prêt</span>
                        <span>18%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[18%]" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeAdminTab === 'categories' && <CategoryManager />}
          {activeAdminTab === 'products' && <ProductManager />}
          {activeAdminTab === 'orders' && <OrderManager />}
          {activeAdminTab === 'users' && <UserManager />}
          {activeAdminTab === 'analytics' && <AnalyticsManager />}
          {activeAdminTab === 'coupons' && <CouponManager />}
          {activeAdminTab === 'reviews' && <ReviewManager />}
          {activeAdminTab === 'cms' && <CMSSettings />}
        </main>
      </div>

    </div>
  );
};
