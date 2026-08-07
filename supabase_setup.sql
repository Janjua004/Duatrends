-- ============================================================================
-- DUA TRENDS / STYLEWING PRODUCTION SUPABASE DATABASE SETUP SCRIPT
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  data JSONB NOT NULL,
  clicks INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  item_count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  country TEXT DEFAULT 'Pakistan',
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Unpaid',
  payment_reference TEXT,
  safepay_tracker TEXT,
  paid_at TIMESTAMPTZ,
  downpayment_amount NUMERIC DEFAULT 0,
  remaining_cod_amount NUMERIC DEFAULT 0,
  grand_total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  min_purchase NUMERIC DEFAULT 0,
  expiry_date TEXT,
  usage_limit INT DEFAULT 100,
  times_used INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_title TEXT,
  user_name TEXT NOT NULL,
  user_city TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Site Settings Table (For Announcement Ticker, WhatsApp Number, Admin Pass)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'master_config',
  announcement_text TEXT,
  whatsapp_number TEXT,
  free_shipping_limit NUMERIC DEFAULT 5000,
  flat_shipping_fee NUMERIC DEFAULT 250,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENABLE REALTIME PUBLICATION FOR INSTANT SYNC ACROSS ALL DEVICES WORLDWIDE
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;

-- Set Row Level Security (RLS) policies to allow public read & write access
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Orders" ON public.orders FOR ALL USING (true);

CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Coupons" ON public.coupons FOR ALL USING (true);

CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Reviews" ON public.reviews FOR ALL USING (true);

CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update Settings" ON public.site_settings FOR ALL USING (true);

-- 7. Create Device Registration Audit Table (For Backend Device Rate-Limiting)
CREATE TABLE IF NOT EXISTS public.device_registrations (
  id BIGSERIAL PRIMARY KEY,
  device_fingerprint TEXT NOT NULL,
  registered_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.device_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Insert Device Regs" ON public.device_registrations FOR ALL USING (true);

-- 8. Create Safepay Verified Transactions Log Table
CREATE TABLE IF NOT EXISTS public.safepay_transactions (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL,
  tracker TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'PKR',
  status TEXT DEFAULT 'COMPLETED',
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.safepay_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Insert Safepay Txs" ON public.safepay_transactions FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.safepay_transactions;

-- 9. Create User Carts Table (For Cross-Device Cart Sync)
CREATE TABLE IF NOT EXISTS public.user_carts (
  user_id TEXT PRIMARY KEY,
  cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Insert User Carts" ON public.user_carts FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_carts;

-- 10. Create User Wishlists Table (For Cross-Device Wishlist Sync)
CREATE TABLE IF NOT EXISTS public.user_wishlists (
  user_id TEXT PRIMARY KEY,
  wishlist_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read/Insert User Wishlists" ON public.user_wishlists FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_wishlists;

-- ============================================================================
-- RECOMMENDED SUPABASE DASHBOARD SECURITY SETTINGS:
-- 1. Go to Authentication -> Rate Limits in Supabase Dashboard
-- 2. Set 'Email Signups per Hour' to 2 (to match strict 24h per-device policies)
-- 3. Enable Captcha / Bot Detection under Auth -> Security if automated spam occurs.
-- ============================================================================


