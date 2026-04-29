-- ============================================================
-- Yasmin Flavors - Full Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE public.addresses (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  label         TEXT NOT NULL DEFAULT 'Home',  -- Home, Work, Other
  street        TEXT NOT NULL,
  city          TEXT NOT NULL,
  state         TEXT,
  zip_code      TEXT,
  is_default    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,   -- Burgers, Pizza, Sushi...
  emoji         TEXT,
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO public.categories (name, emoji, sort_order) VALUES
  ('Burgers',  '🍔', 1),
  ('Pizza',    '🍕', 2),
  ('Sushi',    '🍣', 3),
  ('Desserts', '🍰', 4),
  ('Drinks',   '🥤', 5),
  ('Biryani',  '🍛', 6),
  ('Salads',   '🥗', 7),
  ('Noodles',  '🍜', 8);

-- ============================================================
-- MENU ITEMS
-- ============================================================
CREATE TABLE public.menu_items (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id    UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  price          NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),           -- for showing strikethrough price
  image_url      TEXT,
  is_veg         BOOLEAN DEFAULT FALSE,
  is_available   BOOLEAN DEFAULT TRUE,
  stock_count    INTEGER,                  -- NULL = unlimited; set number for "Only X left"
  rating         NUMERIC(2,1) DEFAULT 0,
  review_count   INTEGER DEFAULT 0,
  discount_pct   INTEGER DEFAULT 0,        -- 0-100; shown as "19% OFF" badge
  sort_order     INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE public.wishlist (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id       UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TYPE order_status AS ENUM (
  'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
);

CREATE TABLE public.orders (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number    TEXT UNIQUE NOT NULL,    -- e.g. YF-2024-001
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  address_id      UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  status          order_status DEFAULT 'confirmed',
  subtotal        NUMERIC(10,2) NOT NULL,
  delivery_fee    NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total           NUMERIC(10,2) NOT NULL,
  notes           TEXT,
  stripe_payment_intent_id TEXT,
  paid_at         TIMESTAMPTZ,
  estimated_delivery_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'YF-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD(NEXTVAL('order_seq')::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_seq START 1;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE public.order_items (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_id     UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,             -- snapshot at time of order
  price       NUMERIC(10,2) NOT NULL,    -- snapshot at time of order
  quantity    INTEGER NOT NULL DEFAULT 1,
  subtotal    NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE public.reviews (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id     UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  order_id    UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id, order_id)
);

-- Auto-update item rating after review insert/delete
CREATE OR REPLACE FUNCTION refresh_item_rating()
RETURNS TRIGGER AS $$
DECLARE target_id UUID;
BEGIN
  target_id := COALESCE(NEW.item_id, OLD.item_id);
  UPDATE public.menu_items
  SET
    rating       = (SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM public.reviews WHERE item_id = target_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE item_id = target_id)
  WHERE id = target_id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_item_rating
  AFTER INSERT OR DELETE OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_item_rating();

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  type        TEXT DEFAULT 'order',    -- order | promo | system
  is_read     BOOLEAN DEFAULT FALSE,
  order_id    UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own
CREATE POLICY "users_own_profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Addresses: users own their addresses
CREATE POLICY "users_own_addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- Wishlist: users own their wishlist
CREATE POLICY "users_own_wishlist" ON public.wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Orders: users can see only their orders
CREATE POLICY "users_own_orders" ON public.orders
  FOR ALL USING (auth.uid() = user_id);

-- Order items: accessible via order ownership
CREATE POLICY "users_own_order_items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Reviews: anyone can read, only owner can write
CREATE POLICY "reviews_read_all" ON public.reviews
  FOR SELECT USING (TRUE);
CREATE POLICY "reviews_write_own" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Menu items and categories: public read
ALTER TABLE public.menu_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu_items_read_all"  ON public.menu_items  FOR SELECT USING (TRUE);
CREATE POLICY "categories_read_all" ON public.categories  FOR SELECT USING (TRUE);

-- Notifications: users see their own
CREATE POLICY "users_own_notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);
