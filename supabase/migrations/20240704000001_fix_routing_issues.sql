-- Fix routing issues by ensuring proper RLS policies

-- Ensure users table exists
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  account_type TEXT NOT NULL DEFAULT 'customer',
  reseller_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable row level security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all user data" ON public.users;

-- Create policies
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view all user data"
ON public.users
FOR ALL
USING (auth.jwt() ->> 'user_metadata'::text)::jsonb ->> 'account_type'::text = 'admin';

-- Enable realtime
alter publication supabase_realtime add table public.users;
