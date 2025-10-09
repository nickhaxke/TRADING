/*
  # Create Site Settings and Pricing System

  ## New Tables
  
  1. `site_settings`
    - `id` (uuid, primary key)
    - `site_name` (text) - Platform name
    - `logo_url` (text) - URL to logo image
    - `favicon_url` (text) - URL to favicon
    - `primary_color` (text) - Hex color for branding
    - `secondary_color` (text) - Secondary brand color
    - `support_email` (text) - Support email
    - `support_phone` (text) - Support phone
    - `updated_at` (timestamptz)
    - `updated_by` (uuid) - Admin who updated
    
  2. `pricing_packages`
    - `id` (uuid, primary key)
    - `name` (text) - Package name (e.g., "Basic", "Pro")
    - `description` (text) - Package description
    - `price` (decimal) - Price amount
    - `currency` (text) - Currency code (e.g., "USD")
    - `billing_period` (text) - "monthly" or "yearly"
    - `features` (jsonb) - Array of features
    - `is_popular` (boolean) - Show "Popular" badge
    - `is_active` (boolean) - Enable/disable package
    - `sort_order` (integer) - Display order
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on both tables
  - All authenticated users can read settings
  - Only admins can update settings
  - All users can view active pricing packages
  - Only admins can manage pricing packages
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text DEFAULT 'Trading Journal Pro',
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#7c3aed',
  support_email text,
  support_phone text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO site_settings (id, site_name, support_email)
VALUES ('00000000-0000-0000-0000-000000000001', 'Trading Journal Pro', 'support@tradingjournalpro.com')
ON CONFLICT (id) DO NOTHING;

-- Create pricing_packages table
CREATE TABLE IF NOT EXISTS pricing_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  billing_period text DEFAULT 'monthly',
  features jsonb DEFAULT '[]'::jsonb,
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default pricing packages
INSERT INTO pricing_packages (name, description, price, billing_period, features, is_popular, sort_order)
VALUES 
  ('Free', 'Perfect for getting started', 0.00, 'monthly', 
   '["Basic trade logging", "Simple dashboard", "Free signals", "Risk calculator", "Forex sessions tracker"]'::jsonb,
   false, 1),
  ('Premium', 'Best for serious traders', 29.99, 'monthly',
   '["Everything in Free", "Premium signals", "Advanced analytics", "Compounding challenge", "Priority support", "Export reports", "Mobile app access"]'::jsonb,
   true, 2),
  ('Premium Yearly', 'Save 33% with annual billing', 239.99, 'yearly',
   '["Everything in Premium", "2 months free", "Dedicated account manager", "Custom indicators", "API access"]'::jsonb,
   false, 3)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;

-- Site Settings Policies
CREATE POLICY "Anyone can view site settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Pricing Packages Policies
CREATE POLICY "Anyone can view active pricing packages"
  ON pricing_packages
  FOR SELECT
  TO authenticated
  USING (is_active = true OR is_admin());

CREATE POLICY "Admins can insert pricing packages"
  ON pricing_packages
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update pricing packages"
  ON pricing_packages
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete pricing packages"
  ON pricing_packages
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Trigger to update updated_at on site_settings
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Trigger to update updated_at on pricing_packages
CREATE OR REPLACE FUNCTION update_pricing_packages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pricing_packages_updated_at
  BEFORE UPDATE ON pricing_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_pricing_packages_updated_at();
