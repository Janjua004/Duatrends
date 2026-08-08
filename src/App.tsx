import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { QuickViewModal } from './components/layout/QuickViewModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AuthModal } from './components/auth/AuthModal';
import { CustomerDashboard } from './components/auth/CustomerDashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LogoLoader } from './components/common/LogoLoader';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { WishlistPage } from './pages/WishlistPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PolicyPage } from './pages/PolicyPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AuthPage } from './pages/AuthPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, toastMessage, isAdminLoggedIn } = useStore();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [activeView]);

  if (initialLoading) {
    return <LogoLoader fullScreen message="Loading Dua Trends Luxury Collection..." />;
  }

  const renderPage = () => {
    if (activeView === 'admin' && isAdminLoggedIn) {
      return <AdminDashboard />;
    }

    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'shop':
      case 'offers':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutModal />;
      case 'login':
        return <AuthPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'account':
        return <CustomerDashboard />;
      case 'track':
        return <TrackOrderPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
      case 'refund':
      case 'shipping':
      case 'faq':
      case 'terms':
        return <PolicyPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-poppins selection:bg-brand-pink selection:text-white transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-brand-pink/30 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-brand-pink" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Login Password Modal */}
      <AdminLoginModal />

      {/* Customer Auth Modal (Login / Signup / Forgot Password) */}
      <AuthModal />

      {/* Floating WhatsApp CTA */}
      <FloatingWhatsApp />

      <div>
        {/* Navigation Bar - Rendered on Header for all views including Admin */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main>
          {renderPage()}
        </main>
      </div>

      {/* Footer & Mobile Navigation */}
      <div>
        {activeView !== 'admin' && <Footer />}
        <MobileNav />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainContent />
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
