-- Create users table for storing user profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  account_type TEXT NOT NULL CHECK (account_type IN ('customer', 'reseller', 'admin')),
  reseller_plan TEXT CHECK (reseller_plan IN ('basic', 'standard', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  sku TEXT UNIQUE,
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_tags table
CREATE TABLE IF NOT EXISTS product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(product_id, tag)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reseller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  redirect_url TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 5,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_sections table
CREATE TABLE IF NOT EXISTS product_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bestsellers', 'offers', 'new-arrivals', 'custom')),
  layout TEXT NOT NULL CHECK (layout IN ('vertical', 'horizontal')),
  active BOOLEAN DEFAULT TRUE,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_section_items table
CREATE TABLE IF NOT EXISTS product_section_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES product_sections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  UNIQUE(section_id, product_id)
);

-- Create currency_rates table
CREATE TABLE IF NOT EXISTS currency_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usd_to_iqd DECIMAL(10, 2) NOT NULL,
  sar_to_iqd DECIMAL(10, 2) NOT NULL,
  usd_to_sar DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_section_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
CREATE POLICY "Admins can view all profiles"
  ON users FOR SELECT
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update all profiles" ON users;
CREATE POLICY "Admins can update all profiles"
  ON users FOR UPDATE
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

-- Create policies for products table
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

-- Create policies for orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Resellers can view orders placed through them" ON orders;
CREATE POLICY "Resellers can view orders placed through them"
  ON orders FOR SELECT
  USING (auth.uid() = reseller_id);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any order" ON orders;
CREATE POLICY "Admins can update any order"
  ON orders FOR UPDATE
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

-- Create policies for advertisements table
DROP POLICY IF EXISTS "Anyone can view advertisements" ON advertisements;
CREATE POLICY "Anyone can view advertisements"
  ON advertisements FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage advertisements" ON advertisements;
CREATE POLICY "Admins can manage advertisements"
  ON advertisements FOR ALL
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

-- Create policies for product_sections table
DROP POLICY IF EXISTS "Anyone can view product sections" ON product_sections;
CREATE POLICY "Anyone can view product sections"
  ON product_sections FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage product sections" ON product_sections;
CREATE POLICY "Admins can manage product sections"
  ON product_sections FOR ALL
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

-- Create policies for currency_rates table
DROP POLICY IF EXISTS "Anyone can view currency rates" ON currency_rates;
CREATE POLICY "Anyone can view currency rates"
  ON currency_rates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can update currency rates" ON currency_rates;
CREATE POLICY "Admins can update currency rates"
  ON currency_rates FOR UPDATE
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

-- Enable realtime for relevant tables
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table advertisements;
alter publication supabase_realtime add table product_sections;
alter publication supabase_realtime add table currency_rates;

-- Insert initial currency rates
INSERT INTO currency_rates (usd_to_iqd, sar_to_iqd, usd_to_sar)
VALUES (1460, 389.33, 3.75)
ON CONFLICT DO NOTHING;
