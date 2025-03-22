-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create admin_activity_logs table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT admin_activity_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_api_keys table
CREATE TABLE IF NOT EXISTS admin_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT admin_api_keys_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create admin_dashboard_widgets table
CREATE TABLE IF NOT EXISTS admin_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  widget_title TEXT NOT NULL,
  widget_config JSONB NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT admin_dashboard_widgets_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add admin_permissions field to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'admin_permissions') THEN
    ALTER TABLE users ADD COLUMN admin_permissions JSONB;
  END IF;
END $$;

-- Add last_login_at field to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_login_at') THEN
    ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add login_count field to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'login_count') THEN
    ALTER TABLE users ADD COLUMN login_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create RLS policies

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all user data" ON users;
CREATE POLICY "Admins can view all user data"
  ON users FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can update all user data" ON users;
CREATE POLICY "Admins can update all user data"
  ON users FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

-- Admin activity logs policies
DROP POLICY IF EXISTS "Admins can insert their own activity logs" ON admin_activity_logs;
CREATE POLICY "Admins can insert their own activity logs"
  ON admin_activity_logs FOR INSERT
  WITH CHECK (admin_id = auth.uid() AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can view all activity logs" ON admin_activity_logs;
CREATE POLICY "Admins can view all activity logs"
  ON admin_activity_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

-- Admin settings policies
DROP POLICY IF EXISTS "Admins can view all settings" ON admin_settings;
CREATE POLICY "Admins can view all settings"
  ON admin_settings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can update settings" ON admin_settings;
CREATE POLICY "Admins can update settings"
  ON admin_settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can insert settings" ON admin_settings;
CREATE POLICY "Admins can insert settings"
  ON admin_settings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

-- Admin API keys policies
DROP POLICY IF EXISTS "Admins can manage their own API keys" ON admin_api_keys;
CREATE POLICY "Admins can manage their own API keys"
  ON admin_api_keys FOR ALL
  USING (admin_id = auth.uid() AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

-- Admin dashboard widgets policies
DROP POLICY IF EXISTS "Admins can manage their own dashboard widgets" ON admin_dashboard_widgets;
CREATE POLICY "Admins can manage their own dashboard widgets"
  ON admin_dashboard_widgets FOR ALL
  USING (admin_id = auth.uid() AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.account_type = 'admin'
  ));

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_api_keys;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_dashboard_widgets;

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value, description)
VALUES 
('platform_name', '{"value": "ShopHub"}', 'Platform name displayed throughout the site'),
('platform_description', '{"value": "Multi-tier e-commerce platform with reseller capabilities"}', 'Platform description for SEO and about pages'),
('maintenance_mode', '{"enabled": false, "message": "We are currently performing maintenance. Please check back soon."}', 'Toggle maintenance mode for the platform'),
('email_verification_required', '{"enabled": true}', 'Whether email verification is required for new accounts'),
('allow_reseller_registration', '{"enabled": true}', 'Whether users can register as resellers'),
('default_currency', '{"code": "USD", "symbol": "$"}', 'Default currency for the platform')
ON CONFLICT (setting_key) DO NOTHING;
