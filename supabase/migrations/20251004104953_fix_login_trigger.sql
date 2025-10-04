/*
  # Fix Login Trigger Issue

  1. Changes
    - Update the update_last_login function to handle errors gracefully
    - Ensure it doesn't fail silently if user profile doesn't exist
    - Add better error handling to prevent login failures

  2. Security
    - Keep SECURITY DEFINER to bypass RLS
    - Only update last_login field, nothing else
*/

-- Drop and recreate the update_last_login function with better error handling
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS trigger AS $$
BEGIN
  -- Only update if last_sign_in_at has changed
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
    -- Try to update, but don't fail if profile doesn't exist
    UPDATE user_profiles 
    SET last_login = NEW.last_sign_in_at
    WHERE user_id = NEW.id;
    
    -- If no profile exists, create one
    IF NOT FOUND THEN
      INSERT INTO user_profiles (user_id, username, last_login, created_at)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.last_sign_in_at,
        NOW()
      )
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent login
    RAISE WARNING 'Failed to update last_login for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
