import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductManager } from './ProductManager';
import { OrderManager } from './OrderManager';
import { AnalyticsManager } from './AnalyticsManager';
import { CouponManager } from './CouponManager';
import { ReviewManager } from './ReviewManager';
import { CMSSettings } from './CMSSettings';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  MessageCircle, 
  DollarSign, 
  BarChart3, 
  Tag, 
  Star, 
  Settings, 
  Sun, 
  Moon, 
  ArrowUpRight,
  MousePointerClick,
  Lock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    coupons, 
    reviews, 
    activeAdminTab, 
    setActiveAdminTab,
    darkMode,
    setDarkMode,
    setActiveView,
    logoutAdmin
  } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalWhatsAppOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalClicks = products.reduce((sum, p) => sum + (p.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col font-poppins">
      
      {/* Admin Top Navbar */}
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-pink flex items-center justify-center font-bold text-white shadow-lg">
            SW
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-white leading-tight">
              StyleWing Admin Control Panel
            </h1>
            <p className="text-xs text-gray-400">Manage products, track clicks, & process WhatsApp orders</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveView('home')}
            className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition-colors flex items-center gap-1.5"
          >
            <span>Exit to Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={logoutAdmin}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800/40 text-xs font-semibold text-rose-300 transition-colors flex items-center gap-1.5"
            title="Log Out Admin Session"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-950/80 border-r border-gray-800 p-4 space-y-2 flex-shrink-0">
          <button
            onClick={() => setActiveAdminTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'dashboard'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'products'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Product Manager</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-800 text-gray-300">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'orders'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
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
            onClick={() => setActiveAdminTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeAdminTab === 'analytics'
                ? 'bg-brand-pink text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
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
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
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
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
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
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store CMS & WhatsApp</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Rs {totalRevenue.toLocaleString()}</h3>
                  <span className="text-[11px] text-emerald-400 font-semibold">+18.5% this month</span>
                </div>

                <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>WhatsApp Orders</span>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{totalWhatsAppOrders}</h3>
                  <span className="text-[11px] text-rose-400 font-semibold">{pendingOrders} Pending confirmation</span>
                </div>

                <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-brand-pink" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{products.length}</h3>
                  <span className="text-[11px] text-gray-400 font-semibold">100 items from stylewing.pk</span>
                </div>

                <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Product Clicks Tracked</span>
                    <MousePointerClick className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{totalClicks}</h3>
                  <span className="text-[11px] text-amber-400 font-semibold">Live interaction data</span>
                </div>

              </div>

              {/* Graphical Overview Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sales Chart Mockup */}
                <div className="lg:col-span-2 bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-white">Sales & Orders Volume</h3>
                    <span className="text-xs text-gray-400 bg-gray-900 px-3 py-1 rounded-full">Last 7 Days</span>
                  </div>

                  <div className="h-56 flex items-end gap-3 pt-6 px-2">
                    {[65, 80, 45, 95, 120, 110, 140].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-brand-pink/20 to-brand-pink rounded-t-xl transition-all duration-500 hover:opacity-80"
                          style={{ height: `${(val / 150) * 100}%` }}
                        />
                        <span className="text-[10px] text-gray-500 font-mono">Day {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Categories Widget */}
                <div className="bg-gray-950 p-6 rounded-3xl border border-gray-800 space-y-4">
                  <h3 className="font-serif font-bold text-lg text-white">Top Categories</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Unstitched Lawn</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-pink h-full w-[42%]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Silk Chiffon Formal</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[28%]" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Casual Prêt</span>
                        <span>18%</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[18%]" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeAdminTab === 'products' && <ProductManager />}
          {activeAdminTab === 'orders' && <OrderManager />}
          {activeAdminTab === 'analytics' && <AnalyticsManager />}
          {activeAdminTab === 'coupons' && <CouponManager />}
          {activeAdminTab === 'reviews' && <ReviewManager />}
          {activeAdminTab === 'cms' && <CMSSettings />}
        </main>
      </div>

    </div>
  );
};
