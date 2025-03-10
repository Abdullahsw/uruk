-- Fix permissions for auth operations

-- Enable public access to auth.users for the password reset function to work
DROP POLICY IF EXISTS "Public users are viewable" ON auth.users;
CREATE POLICY "Public users are viewable" ON auth.users FOR SELECT USING (true);

-- Add policy for password reset tokens to allow creation
DROP POLICY IF EXISTS "Anyone can create reset tokens" ON password_reset_tokens;
CREATE POLICY "Anyone can create reset tokens"
  ON password_reset_tokens FOR INSERT
  WITH CHECK (true);

-- Add policy for password reset tokens to allow updates (marking as used)
DROP POLICY IF EXISTS "Anyone can update their own reset tokens" ON password_reset_tokens;
CREATE POLICY "Anyone can update their own reset tokens"
  ON password_reset_tokens FOR UPDATE
  USING (true);

-- Fix users table policies to ensure proper access
DROP POLICY IF EXISTS "Public users are viewable" ON users;
CREATE POLICY "Public users are viewable"
  ON users FOR SELECT
  USING (true);

-- Ensure users can be created during registration
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Fix auth.users reference in users table
ALTER TABLE IF EXISTS users
  DROP CONSTRAINT IF EXISTS users_id_fkey,
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS users_account_type_idx ON users(account_type);
CREATE INDEX IF NOT EXISTS users_username_idx ON users(username);
CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON password_reset_tokens(token);
