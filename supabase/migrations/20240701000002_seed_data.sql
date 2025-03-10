-- Skip admin user creation since it already exists
-- We'll only seed products and other data

-- Seed sample products
INSERT INTO products (id, title, description, price, discount, stock, category, sku, is_new)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Premium Wireless Headphones', 'Experience premium sound quality with these wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.', 129.99, 15, 24, 'Electronics', 'WH-1000XM4', true),
  ('00000000-0000-0000-0000-000000000002', 'Smart Watch Series 5', 'Stay connected and track your fitness with this advanced smartwatch. Features include heart rate monitoring, GPS, and a bright AMOLED display.', 249.99, 0, 15, 'Electronics', 'SW-SERIES5', true),
  ('00000000-0000-0000-0000-000000000003', 'Portable Bluetooth Speaker', 'Take your music anywhere with this portable Bluetooth speaker. Featuring 360° sound, waterproof design, and 12-hour battery life.', 79.99, 10, 32, 'Electronics', 'BT-SPEAKER-X3', false)
ON CONFLICT (id) DO NOTHING;

-- Seed product images
INSERT INTO product_images (product_id, image_url, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 0),
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=800&q=80', 1),
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', 2),
  ('00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', 0),
  ('00000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80', 1),
  ('00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', 0),
  ('00000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80', 1)
ON CONFLICT DO NOTHING;

-- Seed product tags
INSERT INTO product_tags (product_id, tag)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'headphones'),
  ('00000000-0000-0000-0000-000000000001', 'wireless'),
  ('00000000-0000-0000-0000-000000000001', 'audio'),
  ('00000000-0000-0000-0000-000000000002', 'smartwatch'),
  ('00000000-0000-0000-0000-000000000002', 'fitness'),
  ('00000000-0000-0000-0000-000000000002', 'wearable'),
  ('00000000-0000-0000-0000-000000000003', 'speaker'),
  ('00000000-0000-0000-0000-000000000003', 'bluetooth'),
  ('00000000-0000-0000-0000-000000000003', 'audio')
ON CONFLICT DO NOTHING;

-- Seed advertisements
INSERT INTO advertisements (id, title, image_url, redirect_url, duration, active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Premium Headphones - 25% Off', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80', '/products/00000000-0000-0000-0000-000000000001', 5, true),
  ('00000000-0000-0000-0000-000000000002', 'New Ultra HD Smart TVs - Shop Now', 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1400&q=80', '/products/category/electronics', 5, true),
  ('00000000-0000-0000-0000-000000000003', 'Bluetooth Speakers - 30% Off', 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1400&q=80', '/products/00000000-0000-0000-0000-000000000003', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Seed product sections
INSERT INTO product_sections (id, title, type, layout, active, "order")
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Bestsellers', 'bestsellers', 'vertical', true, 1),
  ('00000000-0000-0000-0000-000000000002', 'Special Offers', 'offers', 'vertical', true, 2),
  ('00000000-0000-0000-0000-000000000003', 'New Arrivals', 'new-arrivals', 'horizontal', true, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed product section items
INSERT INTO product_section_items (section_id, product_id, display_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 0),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 1),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 2),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 0),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 1),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 0)
ON CONFLICT DO NOTHING;