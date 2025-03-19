-- Fix admin login by ensuring the admin user is confirmed
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin@shophub.com';

-- Ensure the admin user exists in the public.users table
INSERT INTO public.users (id, email, name, account_type, created_at)
SELECT id, email, 'Admin User', 'admin', created_at
FROM auth.users
WHERE email = 'admin@shophub.com'
ON CONFLICT (id) DO NOTHING;
