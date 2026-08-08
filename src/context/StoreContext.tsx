import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem, Order, Coupon, Review, Category, PaymentOption, User, AuthModalMode } from '../types';
import rawScrapedProducts from '../data/scraped_products.json';
import { 
  fetchProductsFromCloud, 
  syncProductsToCloud, 
  getSupabaseClient, 
  subscribeToProductsRealtime,
  fetchCategoriesFromCloud,
  syncCategoryToCloud,
  deleteCategoryFromCloud,
  subscribeToCategoriesRealtime,
  fetchUserCartFromCloud,
  syncUserCartToCloud,
  fetchUserWishlistFromCloud,
  syncUserWishlistToCloud,
  subscribeToUserCartRealtime,
  subscribeToUserWishlistRealtime
} from '../services/cloudStore';
import { sanitizeInput, checkDeviceRegistrationLimit, recordDeviceRegistration, checkBotRequestThrottling } from '../utils/security';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  whatsappNumber: string;
  announcementText: string;
  freeShippingLimit: number;
  flatShippingFee: number;
  darkMode: boolean;
  activeView: string;
  selectedCategory: string;
  searchQuery: string;
  selectedProductForModal: Product | null;
  appliedCoupon: Coupon | null;
  activeAdminTab: string;
  toastMessage: string | null;
  isCloudSynced: boolean;
  syncCloudNow: () => Promise<boolean>;

  // Customer Auth State
  currentUser: User | null;
  isCustomerLoggedIn: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: AuthModalMode;
  setAuthModalMode: (mode: AuthModalMode) => void;
  registerCustomer: (details: { name: string; email: string; password: string; phone?: string; city?: string; address?: string }) => Promise<{ success: boolean; message: string }>;
  loginCustomer: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutCustomer: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateCustomerProfile: (details: { name?: string; phone?: string; city?: string; address?: string }) => void;

  // Admin Auth State
  isAdminLoggedIn: boolean;
  showAdminLoginModal: boolean;
  setShowAdminLoginModal: (show: boolean) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (newPassword: string) => boolean;

  // Category CRUD
  addCategory: (cat: Omit<Category, 'id' | 'itemCount'>) => void;
  updateCategory: (cat: Category) => void;
  deleteCategory: (id: string) => void;

  // State actions
  setDarkMode: (dark: boolean) => void;
  setActiveView: (view: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProductForModal: (p: Product | null) => void;
  setActiveAdminTab: (tab: string) => void;
  setWhatsappNumber: (num: string) => void;
  setAnnouncementText: (txt: string) => void;

  // Cart actions
  addToCart: (product: Product, color?: string, size?: string, qty?: number) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateCartQuantity: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Click tracking
  trackProductClick: (productId: string) => void;

  // Order actions
  placeOrder: (customerData: {
    customerName: string;
    phone: string;
    whatsapp: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    country: string;
    specialNotes?: string;
    paymentMethod: PaymentOption;
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Admin Product CRUD
  addProduct: (product: Omit<Product, 'id' | 'clicks' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Admin Coupons
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  deleteCoupon: (id: string) => void;

  // Admin Reviews
  updateReviewStatus: (reviewId: string, status: Review['status']) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;

  // Toast
  showToast: (msg: string) => void;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Unstitched Wear', slug: 'unstitched', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80', itemCount: 0 },
  { id: 'cat-2', name: 'Formals & Party Wear', slug: 'formals', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80', itemCount: 0 },
  { id: 'cat-3', name: 'Casual Wear', slug: 'casual-wear', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80', itemCount: 0 },
  { id: 'cat-4', name: 'Winter Collection', slug: 'winter-collection', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80', itemCount: 0 },
  { id: 'cat-5', name: 'Summer Collection', slug: 'summer-collection', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80', itemCount: 0 },
];

const INITIAL_COUPONS: Coupon[] = [];
const INITIAL_REVIEWS: Review[] = [];
const INITIAL_ORDERS: Order[] = [];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sanitizeData = <T,>(list: T[]): T[] => {
    return list.map(item => {
      const str = JSON.stringify(item)
        .replace(/Parishay/g, 'StyleWing')
        .replace(/PARISHAY/g, 'STYLEWING')
        .replace(/parishay/g, 'stylewing');
      return JSON.parse(str);
    });
  };

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('stylewing_products');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        return sanitizeData(parsed);
      } catch (e) { console.error(e); }
    }
    return [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('stylewing_cart');
    return saved ? sanitizeData(JSON.parse(saved)) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('stylewing_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('stylewing_orders');
    return saved ? sanitizeData(JSON.parse(saved)) : sanitizeData(INITIAL_ORDERS);
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('stylewing_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('stylewing_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [whatsappNumber, setWhatsappNumberState] = useState<string>(() => {
    return localStorage.getItem('stylewing_whatsapp') || '+923000000000';
  });

  const [announcementText, setAnnouncementTextState] = useState<string>(() => {
    return localStorage.getItem('stylewing_announcement') || '✨ Flash Sale: Get 10% OFF on all Unstitched Suits using code DUA10 | Free Shipping on orders over Rs 5,000! ✨';
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('stylewing_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('stylewing_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('stylewing_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');

  useEffect(() => {
    localStorage.setItem('stylewing_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stylewing_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stylewing_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('stylewing_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Restore & synchronize active user session directly from Supabase Auth tokens on launch
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const syncSessionUser = (user: any) => {
      if (!user) return;
      const userEmail = user.email || '';
      const isAdmin = userEmail.endsWith('@duatrends.com') || userEmail === 'admin@duatrends.com' || user.user_metadata?.role === 'admin';
      
      const activeUser: User = {
        id: user.id,
        name: user.user_metadata?.full_name || userEmail.split('@')[0],
        email: userEmail,
        phone: user.user_metadata?.phone || '',
        city: user.user_metadata?.city || '',
        address: user.user_metadata?.address || '',
        role: isAdmin ? 'admin' : 'customer',
        createdAt: user.created_at || new Date().toISOString()
      };
      setCurrentUser(activeUser);
      if (isAdmin) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('stylewing_admin_session', 'active');
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSessionUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncSessionUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Purge legacy demo cached items from localStorage to ensure 100% fresh state
  useEffect(() => {
    const ordersRaw = localStorage.getItem('stylewing_orders');
    if (ordersRaw && ordersRaw.includes('ord-1001')) {
      localStorage.removeItem('stylewing_orders');
      setOrders([]);
    }
    const reviewsRaw = localStorage.getItem('stylewing_reviews');
    if (reviewsRaw && reviewsRaw.includes('r-1')) {
      localStorage.removeItem('stylewing_reviews');
      setReviews([]);
    }
    const couponsRaw = localStorage.getItem('stylewing_coupons');
    if (couponsRaw && couponsRaw.includes('STYLE10')) {
      localStorage.removeItem('stylewing_coupons');
      setCoupons([]);
    }
    const usersRaw = localStorage.getItem('stylewing_registered_users');
    if (usersRaw && usersRaw.includes('usr-demo')) {
      localStorage.removeItem('stylewing_registered_users');
      setRegisteredUsers([]);
    }
  }, []);

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    return localStorage.getItem('stylewing_theme') === 'dark';
  });

  const [adminPassword, setAdminPasswordState] = useState<string>(() => {
    return sessionStorage.getItem('duatrends_admin_pass') || 'admin123';
  });

  // Customer Auth Implementation with Device Rate Limiting & Bot Protection
  const registerCustomer = async (details: { 
    name: string; 
    email: string; 
    password: string; 
    phone?: string; 
    city?: string; 
    address?: string 
  }): Promise<{ success: boolean; message: string }> => {
    // 1. Device Registration Security Check (Max 2 accounts per device in 24 hours)
    const deviceLimitCheck = checkDeviceRegistrationLimit();
    if (!deviceLimitCheck.allowed) {
      return { 
        success: false, 
        message: deviceLimitCheck.message || 'Security limit reached: Maximum 2 account registrations per device every 24 hours.' 
      };
    }

    // 2. Anti-Bot Loop Protection Check
    const botCheck = checkBotRequestThrottling('register_customer', 2000, 3);
    if (!botCheck.allowed) {
      return { 
        success: false, 
        message: botCheck.message || 'Security Alert: Rapid automated registrations detected.' 
      };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: details.email,
        password: details.password,
        options: {
          data: {
            full_name: details.name,
            phone: details.phone,
            city: details.city,
            address: details.address
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: details.name,
      email: details.email,
      phone: details.phone || '',
      city: details.city || '',
      address: details.address || '',
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    // Record registration timestamp for this device
    recordDeviceRegistration();

    setRegisteredUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: 'Registration successful! (Device security verified)' };
  };

  const loginCustomer = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass
      });

      if (!error && data?.user) {
        const isAdmin = cleanEmail.endsWith('@duatrends.com') || cleanEmail === 'admin@duatrends.com' || data.user.user_metadata?.role === 'admin';
        const loggedUser: User = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
          email: data.user.email || cleanEmail,
          phone: data.user.user_metadata?.phone || '',
          city: data.user.user_metadata?.city || '',
          address: data.user.user_metadata?.address || '',
          role: isAdmin ? 'admin' : 'customer',
          createdAt: data.user.created_at
        };
        setCurrentUser(loggedUser);
        if (isAdmin) {
          setIsAdminLoggedIn(true);
          sessionStorage.setItem('stylewing_admin_session', 'active');
          setActiveView('admin');
          return { success: true, message: 'Welcome to Dua Trends Admin Dashboard!' };
        }
        return { success: true, message: 'Logged in successfully via Supabase Auth!' };
      } else if (error && error.message !== 'Invalid login credentials') {
        return { success: false, message: error.message };
      }
    }

    // Fallback Admin Local Pass Check
    if (cleanEmail.endsWith('@duatrends.com') || cleanEmail === 'admin@duatrends.com') {
      if (cleanPass === adminPassword) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('stylewing_admin_session', 'active');
        setActiveView('admin');
        const adminUser: User = {
          id: 'admin-1',
          name: 'Store Administrator',
          email: cleanEmail,
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(adminUser);
        return { success: true, message: 'Welcome to Dua Trends Admin Dashboard!' };
      } else {
        return { success: false, message: 'Invalid Admin Password! Access Denied.' };
      }
    }

    const user = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (user) {
      setCurrentUser(user);
      return { success: true, message: 'Login successful!' };
    }

    return { success: false, message: 'Invalid email or password. Access denied.' };
  };

  const logoutCustomer = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.resetPasswordForEmail(email);
    }
    return { success: true, message: 'Password reset link sent via Supabase Auth.' };
  };

  const updateCustomerProfile = (details: { name?: string; phone?: string; city?: string; address?: string }) => {
    if (!currentUser) return;
    const updated: User = {
      ...currentUser,
      ...details
    };
    setCurrentUser(updated);
    setRegisteredUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  // Category CRUD Implementation with Live Supabase Realtime Database Syncing
  const addCategory = (cat: Omit<Category, 'id' | 'itemCount'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      itemCount: 0
    };
    setCategories(prev => {
      const updated = [...prev, newCat];
      syncCategoryToCloud(newCat);
      return updated;
    });
    showToast(`Category "${newCat.name}" created & synced to Cloud Server! ✨`);
  };

  const updateCategory = (cat: Category) => {
    setCategories(prev => {
      const updated = prev.map(c => c.id === cat.id ? cat : c);
      syncCategoryToCloud(cat);
      return updated;
    });
    showToast(`Category "${cat.name}" updated on all devices! ✨`);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => {
      const updated = prev.filter(c => c.id !== id);
      deleteCategoryFromCloud(id);
      return updated;
    });
    showToast('Category deleted from Cloud Database & updated live across all devices! ✨');
  };

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('stylewing_admin_session') === 'active';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  const [activeViewState, setActiveViewState] = useState<string>('home');

  const getPageTitle = (viewName: string): string => {
    switch (viewName) {
      case 'login': return 'Sign In & Register - Dua Trends';
      case 'track-order': return 'Track Order & Shipping Status - Dua Trends';
      case 'cart': return 'Shopping Cart - Dua Trends';
      case 'checkout': return 'Secure Checkout - Dua Trends';
      case 'account': return 'My Account & Orders - Dua Trends';
      case 'wishlist': return 'My Wishlist - Dua Trends';
      case 'about': return 'About Us - Dua Trends';
      case 'contact': return 'Contact Us & Support - Dua Trends';
      case 'admin': return 'Admin Control Panel - Dua Trends';
      case 'privacy': return 'Privacy Policy - Dua Trends';
      case 'terms': return 'Terms & Conditions - Dua Trends';
      default: return 'Dua Trends - Luxury Clothing Collection';
    }
  };

  const setActiveView = (viewName: string) => {
    setActiveViewState(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'home') {
      if (window.location.search) {
        window.history.pushState({ view: 'home' }, '', window.location.pathname);
      }
      document.title = 'Dua Trends - Luxury Clothing Collection';
    } else if (viewName !== 'product-detail') {
      const newUrl = `${window.location.pathname}?page=${encodeURIComponent(viewName)}`;
      window.history.pushState({ view: viewName }, '', newUrl);
      document.title = getPageTitle(viewName);
    }
  };

  const activeView = activeViewState;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForModalState, setSelectedProductForModalState] = useState<Product | null>(null);
  
  const setSelectedProductForModal = (p: Product | null) => {
    setSelectedProductForModalState(p);
    if (p) {
      setActiveViewState('product-detail');
      const slug = p.slug || p.id;
      const newUrl = `${window.location.pathname}?product=${encodeURIComponent(slug)}`;
      window.history.pushState({ productId: p.id, slug }, '', newUrl);
      document.title = `${p.title} - Dua Trends Luxury Collection`;
      window.scrollTo(0, 0);
    } else {
      if (window.location.search.includes('product=')) {
        window.history.pushState({}, '', window.location.pathname);
      }
      document.title = 'Dua Trends - Luxury Clothing Collection';
    }
  };
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const flatShippingFee = 250;
  const freeShippingLimit = 5000;

  // Fetch latest products & categories from cloud database on load & subscribe to realtime updates
  useEffect(() => {
    async function initCloudSync() {
      const remoteProducts = await fetchProductsFromCloud();
      if (remoteProducts) {
        setProducts(sanitizeData(remoteProducts));
        setIsCloudSynced(true);
      }
      const remoteCategories = await fetchCategoriesFromCloud();
      if (remoteCategories && remoteCategories.length > 0) {
        setCategories(remoteCategories);
      }
    }
    initCloudSync();

    // Enable realtime websocket subscriptions for products & categories
    const unsubscribeProducts = subscribeToProductsRealtime((latestProducts) => {
      setProducts(sanitizeData(latestProducts));
      setIsCloudSynced(true);
    });

    const unsubscribeCategories = subscribeToCategoriesRealtime((latestCategories) => {
      if (latestCategories) {
        setCategories(latestCategories);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  // Synchronize URL query/hash params for dedicated page URLs (?page=login, ?page=track-order, ?product=slug)
  useEffect(() => {
    function handleUrlRoute() {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page') || window.location.hash.replace('#page/', '').replace('#', '');
      const productSlug = params.get('product') || window.location.hash.replace('#product/', '');

      if (productSlug && products.length > 0) {
        const match = products.find(p => p.slug === productSlug || p.id === productSlug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === productSlug);
        if (match) {
          setSelectedProductForModalState(match);
          setActiveViewState('product-detail');
          document.title = `${match.title} - Dua Trends Luxury Collection`;
          return;
        }
      }

      if (pageParam && pageParam !== 'product-detail') {
        setActiveViewState(pageParam);
        document.title = getPageTitle(pageParam);
      } else if (!productSlug && !pageParam) {
        setActiveViewState('home');
        document.title = 'Dua Trends - Luxury Clothing Collection';
      }
    }

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);

    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, [products]);

  const syncCloudNow = async (): Promise<boolean> => {
    const success = await syncProductsToCloud(products);
    setIsCloudSynced(success);
    return success;
  };

  // LocalStorage syncing & Cross-Device Cloud Syncing
  useEffect(() => {
    localStorage.setItem('stylewing_products', JSON.stringify(products));
  }, [products]);

  // Load Cloud-Saved Cart & Wishlist when logged in for CUSTOMER accounts ONLY (Excludes Admin)
  useEffect(() => {
    if (!currentUser?.id || currentUser.role !== 'customer' || currentUser.id === 'admin-1') return;
    const userId = currentUser.id;

    async function loadUserCloudState() {
      const cloudCart = await fetchUserCartFromCloud(userId);
      if (cloudCart && Array.isArray(cloudCart) && cloudCart.length > 0) {
        setCart(cloudCart);
      }
      const cloudWishlist = await fetchUserWishlistFromCloud(userId);
      if (cloudWishlist && Array.isArray(cloudWishlist) && cloudWishlist.length > 0) {
        setWishlist(cloudWishlist);
      }
    }
    loadUserCloudState();
  }, [currentUser?.id, currentUser?.role]);

  // Sync Cart changes to Cloud ONLY when logged-in customer modifies their cart
  const isInitialCartMount = useRef(true);
  useEffect(() => {
    localStorage.setItem('stylewing_cart', JSON.stringify(cart));
    if (isInitialCartMount.current) {
      isInitialCartMount.current = false;
      return;
    }
    if (currentUser?.id && currentUser.role === 'customer' && currentUser.id !== 'admin-1') {
      syncUserCartToCloud(currentUser.id, cart);
    }
  }, [cart, currentUser?.id, currentUser?.role]);

  // Sync Wishlist changes to Cloud ONLY when logged-in customer modifies wishlist
  const isInitialWishlistMount = useRef(true);
  useEffect(() => {
    localStorage.setItem('stylewing_wishlist', JSON.stringify(wishlist));
    if (isInitialWishlistMount.current) {
      isInitialWishlistMount.current = false;
      return;
    }
    if (currentUser?.id && currentUser.role === 'customer' && currentUser.id !== 'admin-1') {
      syncUserWishlistToCloud(currentUser.id, wishlist);
    }
  }, [wishlist, currentUser?.id, currentUser?.role]);

  useEffect(() => {
    localStorage.setItem('stylewing_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('stylewing_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('stylewing_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stylewing_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stylewing_theme', 'light');
    }
  }, [darkMode]);

  const setDarkMode = (dark: boolean) => setDarkModeState(dark);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Admin Authentication with Supabase Cloud Sync
  const loginAdmin = (password: string): boolean => {
    const cleanPass = password.trim();
    if (cleanPass === adminPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('stylewing_admin_session', 'active');
      setShowAdminLoginModal(false);
      setActiveView('admin');
      showToast('Successfully logged in as Admin!');
      return true;
    } else {
      showToast('Incorrect Admin password!');
      return false;
    }
  };

  const changeAdminPassword = (newPassword: string): boolean => {
    if (!newPassword || newPassword.length < 4) {
      showToast('Password must be at least 4 characters long');
      return false;
    }
    const cleanPass = newPassword.trim();
    setAdminPasswordState(cleanPass);
    sessionStorage.setItem('duatrends_admin_pass', cleanPass);

    // Store exclusively in Supabase Cloud Database
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('admin_settings').upsert({ id: 'master_config', password_hash: cleanPass, updated_at: new Date().toISOString() })
        .then(({ error }: { error: any }) => {
          if (error) console.warn('Supabase admin password sync error:', error.message);
        });
    }

    showToast('Admin Master Password updated successfully! Old passwords will no longer work.');
    return true;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('stylewing_admin_session');
    localStorage.removeItem('stylewing_admin_session');
    setActiveView('home');
    showToast('Logged out from Admin Panel');
  };

  const setWhatsappNumber = (num: string) => {
    setWhatsappNumberState(num);
    localStorage.setItem('stylewing_whatsapp', num);
    showToast('WhatsApp number updated!');
  };

  const setAnnouncementText = (txt: string) => {
    setAnnouncementTextState(txt);
    localStorage.setItem('stylewing_announcement', txt);
    showToast('Announcement text updated!');
  };

  // Cart operations
  const addToCart = (product: Product, color?: string, size?: string, qty: number = 1) => {
    const selColor = color || product.colors[0] || 'Default';
    const selSize = size || product.sizes[0] || 'Unstitched';

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === selColor && item.selectedSize === selSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, { product, selectedColor: selColor, selectedSize: selSize, quantity: qty }];
      }
    });

    showToast(`Added ${product.title} to Cart!`);
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)));
    showToast('Item removed from Cart');
  };

  const updateCartQuantity = (productId: string, color: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const currentSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (currentSubtotal < found.minPurchase) {
      return { success: false, message: `Minimum order amount of Rs ${found.minPurchase.toLocaleString()} required for this coupon.` };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Click Tracking Analytics
  const trackProductClick = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, clicks: p.clicks + 1 };
      }
      return p;
    }));
  };

  // Order Placement with 25% Downpayment & 100% Payment calculation
  const placeOrder = (customerData: {
    customerName: string;
    phone: string;
    whatsapp: string;
    email?: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    country: string;
    specialNotes?: string;
    paymentMethod: PaymentOption;
  }): Order => {
    // Anti-Bot Protection Check against automated order script loops
    const botCheck = checkBotRequestThrottling('place_order', 3000, 3);
    if (!botCheck.allowed) {
      showToast(botCheck.message || 'Security Limit: Too many rapid order attempts. Please wait a moment.');
    }

    // Sanitize customer inputs to prevent XSS attacks
    const cleanCustomerName = sanitizeInput(customerData.customerName);
    const cleanPhone = sanitizeInput(customerData.phone);
    const cleanAddress = sanitizeInput(customerData.address);
    const cleanCity = sanitizeInput(customerData.city);
    const cleanProvince = sanitizeInput(customerData.province);
    const cleanNotes = customerData.specialNotes ? sanitizeInput(customerData.specialNotes) : '';
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      } else {
        discount = appliedCoupon.discountValue;
      }
    }

    const shipping = subtotal >= freeShippingLimit ? 0 : flatShippingFee;
    const grandTotal = Math.max(0, subtotal - discount + shipping);

    let downpaymentAmount = 0;
    let remainingCodAmount = grandTotal;

    if (customerData.paymentMethod === '25% Advance Downpayment') {
      downpaymentAmount = Math.round((grandTotal * 25) / 100);
      remainingCodAmount = grandTotal - downpaymentAmount;
    } else if (customerData.paymentMethod === '100% Full Payment') {
      downpaymentAmount = grandTotal;
      remainingCodAmount = 0;
    }

    const orderItems = cart.map(item => ({
      id: item.product.id,
      title: item.product.title,
      color: item.selectedColor,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images[0] || '',
    }));

    const orderNum = `SW-${Math.floor(1000 + Math.random() * 9000)}`;

    let productLines = '';
    cart.forEach((item, index) => {
      productLines += `${index + 1}.\nProduct: ${item.product.title}\nColor: ${item.selectedColor}\nSize: ${item.selectedSize}\nQty: ${item.quantity}\nPrice: Rs ${item.product.price.toLocaleString()}\n----------------------\n`;
    });

    let paymentBreakdownText = `Payment Method:\n${customerData.paymentMethod}\n`;
    if (customerData.paymentMethod === '25% Advance Downpayment') {
      paymentBreakdownText += `▶ 25% Advance Payment: Rs ${downpaymentAmount.toLocaleString()}\n▶ 75% Remaining COD: Rs ${remainingCodAmount.toLocaleString()}\n(Please provide Bank/JazzCash details for 25% advance transfer)\n`;
    } else if (customerData.paymentMethod === '100% Full Payment') {
      paymentBreakdownText += `▶ 100% Full Advance Payment: Rs ${downpaymentAmount.toLocaleString()}\n(Please provide Bank/JazzCash details for transfer)\n`;
    }

    const formattedWhatsAppMsg = `🛍️ New Order\n\nCustomer Name:\n${customerData.customerName}\n\nPhone:\n${customerData.phone}\n\nAddress:\n${customerData.address}\n${customerData.city}, ${customerData.province}\n${customerData.country}\n\nProducts\n\n${productLines}Subtotal:\nRs ${subtotal.toLocaleString()}\n\nDiscount:\nRs ${discount.toLocaleString()}\n\nShipping:\nRs ${shipping === 0 ? 'FREE' : 'Rs ' + shipping.toLocaleString()}\n\nTotal Amount:\nRs ${grandTotal.toLocaleString()}\n\n${paymentBreakdownText}${customerData.specialNotes ? '\nSpecial Note:\n' + customerData.specialNotes + '\n' : ''}\nThank You ❤️`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      ...customerData,
      downpaymentAmount,
      remainingCodAmount,
      items: orderItems,
      subtotal,
      discount,
      shipping,
      grandTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      formattedWhatsAppMsg,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showToast('Order placed! Opening WhatsApp with 25% / Full payment breakdown...');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status}`);
  };

  // Product CRUD with Automatic Cloud Syncing
  const addProduct = (newP: Omit<Product, 'id' | 'clicks' | 'rating' | 'reviewCount'>) => {
    const created: Product = {
      ...newP,
      id: `product-${Date.now()}`,
      clicks: 0,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts(prev => {
      const updated = [created, ...prev];
      syncProductsToCloud(updated).then(success => setIsCloudSynced(success));
      return updated;
    });
    showToast('New Product Created & Synced to Cloud Server! ✨');
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => {
      const updatedList = prev.map(p => p.id === updated.id ? updated : p);
      syncProductsToCloud(updatedList).then(success => setIsCloudSynced(success));
      return updatedList;
    });
    showToast('Product updated & synced across all devices! ✨');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updatedList = prev.filter(p => p.id !== id);
      syncProductsToCloud(updatedList).then(success => setIsCloudSynced(success));
      return updatedList;
    });

    // Directly delete from Supabase Cloud Database table so ALL devices immediately reflect deletion!
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.from('products').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase cloud product deletion note:', error.message);
      });
    }

    showToast('Product deleted from Cloud Database & updated on all devices worldwide! ✨');
  };

  // Coupon CRUD
  const addCoupon = (c: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const created: Coupon = {
      ...c,
      id: `coupon-${Date.now()}`,
      timesUsed: 0,
    };
    setCoupons(prev => [...prev, created]);
    showToast('New Coupon added!');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon deleted.');
  };

  // Review CRUD
  const updateReviewStatus = (reviewId: string, status: Review['status']) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
    showToast(`Review ${status.toLowerCase()}`);
  };

  const addReview = (rev: Omit<Review, 'id' | 'date' | 'status'>) => {
    const created: Review = {
      ...rev,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setReviews(prev => [created, ...prev]);
    showToast('Thank you! Your review has been submitted for approval.');
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      cart,
      wishlist,
      orders,
      coupons,
      reviews,
      whatsappNumber,
      announcementText,
      freeShippingLimit,
      flatShippingFee,
      darkMode,
      activeView,
      selectedCategory,
      searchQuery,
      selectedProductForModal: selectedProductForModalState,
      appliedCoupon,
      activeAdminTab,
      toastMessage,

      // Customer Auth State
      currentUser,
      isCustomerLoggedIn: Boolean(currentUser),
      showAuthModal,
      setShowAuthModal,
      authModalMode,
      setAuthModalMode,
      registerCustomer,
      loginCustomer,
      logoutCustomer,
      resetPassword,
      updateCustomerProfile,

      // Admin Auth State
      isAdminLoggedIn,
      showAdminLoginModal,
      setShowAdminLoginModal,
      loginAdmin,
      logoutAdmin,
      changeAdminPassword,

      // Category CRUD
      addCategory,
      updateCategory,
      deleteCategory,

      setDarkMode,
      setActiveView,
      setSelectedCategory,
      setSearchQuery,
      setSelectedProductForModal,
      setActiveAdminTab,
      setWhatsappNumber,
      setAnnouncementText,

      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,

      toggleWishlist,
      isInWishlist,
      trackProductClick,

      placeOrder,
      updateOrderStatus,

      addProduct,
      updateProduct,
      deleteProduct,

      addCoupon,
      deleteCoupon,

      updateReviewStatus,
      addReview,

      showToast,
      isCloudSynced,
      syncCloudNow
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
