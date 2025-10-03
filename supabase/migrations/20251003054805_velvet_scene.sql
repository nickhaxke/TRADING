/*
  # Add User Roles and Enhanced User Management

  1. New Tables
    - Enhanced `user_profiles` table with roles and status
    - Add user roles (admin, user, premium)
    - Add user status tracking
    - Add profile completion tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Admin can view all users
    - Users can only see their own data

  3. Features
    - User registration tracking
    - Role-based access control
    - Profile management
    - Admin dashboard capabilities
*/

-- Add role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update user_profiles table with new columns
DO $$
BEGIN
  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role user_role DEFAULT 'user';
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN status user_status DEFAULT 'active';
  END IF;

  -- Add last_login column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_login timestamptz;
  END IF;

  -- Add profile_completed column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'profile_completed'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_completed boolean DEFAULT false;
  END IF;

  -- Add registration_ip column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'registration_ip'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN registration_ip inet;
  END IF;

  -- Add country column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country text;
  END IF;
END $$;

-- Create admin_users table for admin management
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  permissions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- RLS Policies for user_profiles (updated)
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    (OLD.role = NEW.role OR EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    ))
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS trigger AS $$
BEGIN
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
    UPDATE user_profiles 
    SET last_login = NEW.last_sign_in_at
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for login tracking
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION update_last_login();

-- Insert some sample users (for demonstration)
INSERT INTO user_profiles (user_id, username, role, status, country, created_at, last_login, profile_completed)
VALUES 
  (gen_random_uuid(), 'TraderPro2024', 'user', 'active', 'United States', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes', true),
  (gen_random_uuid(), 'ForexMaster', 'premium', 'active', 'United Kingdom', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 hour', true),
  (gen_random_uuid(), 'PipHunter', 'user', 'active', 'Germany', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '2 hours', true),
  (gen_random_uuid(), 'TradingGuru', 'user', 'active', 'Japan', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '3 hours', false),
  (gen_random_uuid(), 'MarketAnalyst', 'premium', 'active', 'Australia', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '4 hours', true),
  (gen_random_uuid(), 'CryptoKing', 'user', 'active', 'Canada', NOW() - INTERVAL '1 day', NOW() - INTERVAL '6 hours', true),
  (gen_random_uuid(), 'SwingTrader', 'user', 'active', 'France', NOW() - INTERVAL '2 days', NOW() - INTERVAL '8 hours', false),
  (gen_random_uuid(), 'DayTrader99', 'user', 'active', 'Singapore', NOW() - INTERVAL '3 days', NOW() - INTERVAL '12 hours', true),
  (gen_random_uuid(), 'ScalpMaster', 'premium', 'active', 'Switzerland', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', true),
  (gen_random_uuid(), 'TrendFollower', 'user', 'active', 'Netherlands', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days', true)
ON CONFLICT (user_id) DO NOTHING;