import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Category, CartItem } from '../types';

// Default Supabase / Cloud REST storage keys
const STORAGE_SUPABASE_URL_KEY = 'stylewing_supabase_url';
const STORAGE_SUPABASE_ANON_KEY = 'stylewing_supabase_anon_key';
const STORAGE_CUSTOM_REST_URL_KEY = 'stylewing_custom_rest_url';

const metaEnv = (import.meta as any).env || {};
const DEFAULT_SUPABASE_URL = metaEnv.VITE_SUPABASE_URL || 'https://iznrzssyzhecqpmxftmy.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = metaEnv.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bnJ6c3N5emhlY3FwbXhmdG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTE0NDIsImV4cCI6MjEwMTMyNzQ0Mn0.ZjI3def5kxfpByGm2MpjBBh381S8npGGvGI3EZwNobM';

let cachedSupabaseClient: SupabaseClient | null = null;

/**
 * Get active Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = localStorage.getItem(STORAGE_SUPABASE_URL_KEY) || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem(STORAGE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;

  if (url && key) {
    if (!cachedSupabaseClient) {
      cachedSupabaseClient = createClient(url, key);
    }
    return cachedSupabaseClient;
  }
  return null;
}

/**
 * Configure Supabase or Custom REST credentials in local storage
 */
export function configureCloudDatabase(supabaseUrl?: string, supabaseKey?: string, restUrl?: string) {
  if (supabaseUrl && supabaseKey) {
    localStorage.setItem(STORAGE_SUPABASE_URL_KEY, supabaseUrl.trim());
    localStorage.setItem(STORAGE_SUPABASE_ANON_KEY, supabaseKey.trim());
    cachedSupabaseClient = createClient(supabaseUrl.trim(), supabaseKey.trim());
  }
  if (restUrl) {
    localStorage.setItem(STORAGE_CUSTOM_REST_URL_KEY, restUrl.trim());
  }
}

/**
 * Clear configured cloud database settings
 */
export function clearCloudDatabaseConfig() {
  localStorage.removeItem(STORAGE_SUPABASE_URL_KEY);
  localStorage.removeItem(STORAGE_SUPABASE_ANON_KEY);
  localStorage.removeItem(STORAGE_CUSTOM_REST_URL_KEY);
  cachedSupabaseClient = null;
}

/**
 * Test connectivity to configured Supabase or REST Cloud Database
 */
export async function testCloudConnection(): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseClient();
  const customRestUrl = localStorage.getItem(STORAGE_CUSTOM_REST_URL_KEY);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').limit(1);
      if (error) {
        // Table might not exist yet, test simple ping
        const { error: pingErr } = await supabase.from('_health').select('*').limit(1);
        if (pingErr && pingErr.code !== 'PGRST116' && pingErr.code !== '42P01') {
          return { success: false, message: `Supabase Error: ${error.message}` };
        }
      }
      return { success: true, message: 'Connected to Supabase Cloud Database!' };
    } catch (err: any) {
      return { success: false, message: `Supabase connection failed: ${err.message || err}` };
    }
  }

  if (customRestUrl) {
    try {
      const res = await fetch(customRestUrl, { method: 'GET' });
      if (res.ok) {
        return { success: true, message: 'Connected to Custom REST Database API!' };
      }
      return { success: false, message: `REST API returned status ${res.status}` };
    } catch (err: any) {
      return { success: false, message: `REST API connection failed: ${err.message || err}` };
    }
  }

  return {
    success: false,
    message: 'No cloud database configured. Please enter your Supabase URL & Anon Key or REST API endpoint.'
  };
}

/**
 * Fetch latest products from the cloud database server
 */
export async function fetchProductsFromCloud(): Promise<Product[] | null> {
  // 1. Try Supabase Client
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (!error && Array.isArray(data)) {
        const formatted = data.map(item => typeof item.data === 'object' ? item.data : item);
        localStorage.setItem('stylewing_products', JSON.stringify(formatted));
        return formatted as Product[];
      }
    } catch (err) {
      console.warn('Supabase fetch error:', err);
    }
  }

  // 2. Try Custom REST endpoint if set
  const customRestUrl = localStorage.getItem(STORAGE_CUSTOM_REST_URL_KEY);
  if (customRestUrl) {
    try {
      const response = await fetch(customRestUrl, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        const productsList = Array.isArray(data) ? data : data?.products || data?.record || null;
        if (Array.isArray(productsList) && productsList.length > 0) {
          localStorage.setItem('stylewing_products', JSON.stringify(productsList));
          return productsList as Product[];
        }
      }
    } catch (err) {
      console.warn('REST API fetch error:', err);
    }
  }

  // 3. Fallback to local storage cache
  const cached = localStorage.getItem('stylewing_products');
  return cached ? JSON.parse(cached) : null;
}

/**
 * Sync updated products array to the cloud database server automatically
 */
export async function syncProductsToCloud(products: Product[]): Promise<boolean> {
  // Always update local cache immediately
  localStorage.setItem('stylewing_products', JSON.stringify(products));

  // 1. Try Supabase Client
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Upsert full catalog into 'products' table
      const rows = products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        data: p,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('products')
        .upsert(rows, { onConflict: 'id' });

      if (!error) return true;
      console.warn('Supabase upsert error:', error);
    } catch (err) {
      console.warn('Supabase sync error:', err);
    }
  }

  // 2. Try Custom REST API endpoint if set
  const customRestUrl = localStorage.getItem(STORAGE_CUSTOM_REST_URL_KEY);
  if (customRestUrl) {
    try {
      const response = await fetch(customRestUrl, {
        method: customRestUrl.includes('firebaseio.com') || customRestUrl.includes('api.') ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
      });

      if (response.ok) return true;
    } catch (err) {
      console.warn('REST API sync error:', err);
    }
  }

  return false;
}

/**
 * Subscribe to realtime PostgreSQL table changes via Supabase WebSockets
 * Minor to minor updates in database will instantly propagate to all connected clients worldwide!
 */
export function subscribeToProductsRealtime(onProductsChange: (products: Product[]) => void): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('realtime-products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          const updatedProducts = await fetchProductsFromCloud();
          if (updatedProducts && updatedProducts.length > 0) {
            onProductsChange(updatedProducts);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription error:', err);
    return () => {};
  }
}

/**
 * Fetch categories from Supabase Cloud Database
 */
export async function fetchCategoriesFromCloud(): Promise<Category[] | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (!error && Array.isArray(data)) {
        const formatted = data.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          image: item.image || '',
          description: item.description || '',
          itemCount: item.item_count || 0
        }));
        localStorage.setItem('stylewing_categories', JSON.stringify(formatted));
        return formatted as Category[];
      }
    } catch (err) {
      console.warn('Supabase categories fetch error:', err);
    }
  }
  const cached = localStorage.getItem('stylewing_categories');
  return cached ? JSON.parse(cached) : null;
}

/**
 * Sync Category changes to Supabase Cloud Database
 */
export async function syncCategoryToCloud(category: Category): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('categories')
        .upsert({
          id: category.id,
          name: category.name,
          slug: category.slug,
          image: category.image,
          item_count: category.itemCount,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (!error) return true;
    } catch (err) {
      console.warn('Supabase category upsert error:', err);
    }
  }
  return false;
}

/**
 * Delete Category from Supabase Cloud Database so all devices reflect deletion
 */
export async function deleteCategoryFromCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (!error) return true;
    } catch (err) {
      console.warn('Supabase category delete error:', err);
    }
  }
  return false;
}

/**
 * Subscribe to Realtime Category table changes across all devices
 */
export function subscribeToCategoriesRealtime(onCategoriesChange: (categories: Category[]) => void): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel('realtime-categories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        async () => {
          const updatedCategories = await fetchCategoriesFromCloud();
          if (updatedCategories) {
            onCategoriesChange(updatedCategories);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Categories realtime subscription error:', err);
    return () => {};
  }
}

/**
 * Fetch Cloud-Saved User Cart from Supabase
 */
export async function fetchUserCartFromCloud(userId: string): Promise<CartItem[] | null> {
  if (!userId) return null;
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_items')
        .eq('user_id', userId)
        .single();

      if (!error && data?.cart_items) {
        return data.cart_items as CartItem[];
      }
    } catch (err) {
      console.warn('User cart fetch error:', err);
    }
  }
  return null;
}

/**
 * Sync User Cart to Supabase Cloud Database (Cross-Device Cart)
 */
export async function syncUserCartToCloud(userId: string, cart: CartItem[]): Promise<boolean> {
  if (!userId) return false;
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('user_carts')
        .upsert({
          user_id: userId,
          cart_items: cart,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (!error) return true;
    } catch (err) {
      console.warn('User cart sync error:', err);
    }
  }
  return false;
}

/**
 * Fetch Cloud-Saved User Wishlist from Supabase
 */
export async function fetchUserWishlistFromCloud(userId: string): Promise<string[] | null> {
  if (!userId) return null;
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_wishlists')
        .select('wishlist_items')
        .eq('user_id', userId)
        .single();

      if (!error && data?.wishlist_items) {
        return data.wishlist_items as string[];
      }
    } catch (err) {
      console.warn('User wishlist fetch error:', err);
    }
  }
  return null;
}

/**
 * Sync User Wishlist to Supabase Cloud Database (Cross-Device Wishlist)
 */
export async function syncUserWishlistToCloud(userId: string, wishlist: string[]): Promise<boolean> {
  if (!userId) return false;
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('user_wishlists')
        .upsert({
          user_id: userId,
          wishlist_items: wishlist,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (!error) return true;
    } catch (err) {
      console.warn('User wishlist sync error:', err);
    }
  }
  return false;
}

/**
 * Subscribe to User Cart Realtime changes
 */
export function subscribeToUserCartRealtime(userId: string, onCartChange: (cart: CartItem[]) => void): () => void {
  if (!userId) return () => {};
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel(`realtime-user-cart-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_carts', filter: `user_id=eq.${userId}` },
        async () => {
          const updatedCart = await fetchUserCartFromCloud(userId);
          if (updatedCart) {
            onCartChange(updatedCart);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('User cart realtime error:', err);
    return () => {};
  }
}

/**
 * Subscribe to User Wishlist Realtime changes
 */
export function subscribeToUserWishlistRealtime(userId: string, onWishlistChange: (wishlist: string[]) => void): () => void {
  if (!userId) return () => {};
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel(`realtime-user-wishlist-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_wishlists', filter: `user_id=eq.${userId}` },
        async () => {
          const updatedWishlist = await fetchUserWishlistFromCloud(userId);
          if (updatedWishlist) {
            onWishlistChange(updatedWishlist);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('User wishlist realtime error:', err);
    return () => {};
  }
}



