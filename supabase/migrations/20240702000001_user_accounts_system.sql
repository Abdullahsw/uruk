-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with additional fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'User' CHECK (role IN ('User', 'Admin', 'Reseller'));

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security on the new table
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for password_reset_tokens
DROP POLICY IF EXISTS "Users can view their own reset tokens" ON password_reset_tokens;
CREATE POLICY "Users can view their own reset tokens"
  ON password_reset_tokens FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all reset tokens" ON password_reset_tokens;
CREATE POLICY "Admins can view all reset tokens"
  ON password_reset_tokens FOR SELECT
  USING ((SELECT account_type FROM users WHERE id = auth.uid()) = 'admin');

-- Create function to handle password reset requests
CREATE OR REPLACE FUNCTION request_password_reset(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  reset_token TEXT;
BEGIN
  -- Find the user by email
  SELECT id INTO user_id FROM users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'User not found';
  END IF;
  
  -- Generate a random token
  reset_token := encode(gen_random_bytes(32), 'hex');
  
  -- Insert the token with expiration (24 hours from now)
  INSERT INTO password_reset_tokens (user_id, token, expires_at)
  VALUES (user_id, reset_token, NOW() + INTERVAL '24 hours');
  
  RETURN reset_token;
END;
$$;

-- Create function to verify and use a password reset token
CREATE OR REPLACE FUNCTION verify_reset_token(token TEXT)
RETURNS TABLE (valid BOOLEAN, user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token_record RECORD;
BEGIN
  -- Find the token
  SELECT * INTO token_record FROM password_reset_tokens 
  WHERE token = verify_reset_token.token AND NOT used AND expires_at > NOW();
  
  IF token_record IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID;
    RETURN;
  END IF;
  
  -- Mark token as used
  UPDATE password_reset_tokens SET used = TRUE WHERE token = verify_reset_token.token;
  
  RETURN QUERY SELECT true, token_record.user_id;
END;
$$;

-- Enable realtime for the new table
alter publication supabase_realtime add table password_reset_tokens;
