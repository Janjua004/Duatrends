import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';

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

      if (!error && Array.isArray(data) && data.length > 0) {
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
