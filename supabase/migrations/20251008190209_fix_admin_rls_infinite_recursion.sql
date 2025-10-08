/*
  # Fix Infinite Recursion in Admin RLS Policies

  ## Problem
  The "Admins can view all profiles" policy creates infinite recursion because:
  - To check if user is admin, it queries user_profiles table
  - But querying user_profiles triggers the same policy check
  - This creates an infinite loop

  ## Solution
  1. Create a helper function with SECURITY DEFINER to bypass RLS
  2. Update admin policies to use this function instead of subquery
  3. This breaks the recursion cycle

  ## Changes
  - Create `is_admin()` function that checks user role without triggering RLS
  - Drop existing admin policies that cause recursion
  - Recreate admin policies using the new function
*/

-- Create helper function to check if current user is admin
-- SECURITY DEFINER allows it to bypass RLS and prevent infinite recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the problematic admin policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;

-- Recreate admin policies using the helper function
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update any profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
