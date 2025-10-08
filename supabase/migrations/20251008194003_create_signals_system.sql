/*
  # Create Trading Signals System

  ## New Tables
  1. `trading_signals`
    - `id` (uuid, primary key)
    - `title` (text) - Signal title/name
    - `description` (text) - Detailed signal description
    - `pair` (text) - Trading pair (e.g., EUR/USD, GBP/JPY)
    - `signal_type` (enum) - BUY or SELL
    - `entry_price` (decimal) - Entry price
    - `stop_loss` (decimal) - Stop loss price
    - `take_profit_1` (decimal) - First TP level
    - `take_profit_2` (decimal) - Second TP level (optional)
    - `take_profit_3` (decimal) - Third TP level (optional)
    - `status` (enum) - ACTIVE, CLOSED, HIT_TP1, HIT_TP2, HIT_TP3, HIT_SL
    - `signal_tier` (enum) - FREE or PREMIUM
    - `posted_by` (uuid) - Admin who posted signal
    - `posted_at` (timestamptz) - When signal was posted
    - `closed_at` (timestamptz) - When signal was closed
    - `result_pips` (decimal) - Result in pips (nullable)
    - `notes` (text) - Additional notes
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on trading_signals table
  - Authenticated users can view signals based on their tier:
    - All users can view FREE signals
    - Only premium/admin users can view PREMIUM signals
  - Only admins can insert/update/delete signals
*/

-- Create enum types
CREATE TYPE signal_type AS ENUM ('BUY', 'SELL');
CREATE TYPE signal_status AS ENUM ('ACTIVE', 'CLOSED', 'HIT_TP1', 'HIT_TP2', 'HIT_TP3', 'HIT_SL');
CREATE TYPE signal_tier AS ENUM ('FREE', 'PREMIUM');

-- Create trading_signals table
CREATE TABLE IF NOT EXISTS trading_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  pair text NOT NULL,
  signal_type signal_type NOT NULL,
  entry_price decimal(10,5) NOT NULL,
  stop_loss decimal(10,5) NOT NULL,
  take_profit_1 decimal(10,5) NOT NULL,
  take_profit_2 decimal(10,5),
  take_profit_3 decimal(10,5),
  status signal_status DEFAULT 'ACTIVE',
  signal_tier signal_tier DEFAULT 'FREE',
  posted_by uuid REFERENCES auth.users(id),
  posted_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  result_pips decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view FREE signals
CREATE POLICY "Users can view free signals"
  ON trading_signals
  FOR SELECT
  TO authenticated
  USING (signal_tier = 'FREE');

-- Policy: Premium and admin users can view PREMIUM signals
CREATE POLICY "Premium users can view premium signals"
  ON trading_signals
  FOR SELECT
  TO authenticated
  USING (
    signal_tier = 'PREMIUM' 
    AND EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('premium', 'admin')
    )
  );

-- Policy: Admins can view all signals
CREATE POLICY "Admins can view all signals"
  ON trading_signals
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Policy: Admins can insert signals
CREATE POLICY "Admins can insert signals"
  ON trading_signals
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Policy: Admins can update signals
CREATE POLICY "Admins can update signals"
  ON trading_signals
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Policy: Admins can delete signals
CREATE POLICY "Admins can delete signals"
  ON trading_signals
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_signals_tier ON trading_signals(signal_tier);
CREATE INDEX IF NOT EXISTS idx_signals_status ON trading_signals(status);
CREATE INDEX IF NOT EXISTS idx_signals_posted_at ON trading_signals(posted_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trading_signals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trading_signals_updated_at
  BEFORE UPDATE ON trading_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_trading_signals_updated_at();
