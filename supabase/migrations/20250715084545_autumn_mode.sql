/*
  # Create trades table for trading journal

  1. New Tables
    - `trades`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date)
      - `pair` (text) - Currency pair like EURUSD
      - `entry_price` (decimal) - Entry price
      - `stop_loss` (decimal) - Stop loss price
      - `take_profit` (decimal) - Take profit price
      - `rr_ratio` (decimal) - Risk/reward ratio
      - `lot_size` (decimal, nullable) - Position size
      - `outcome` (decimal) - Trade outcome in dollars
      - `reason` (text) - Trade setup/reason
      - `notes` (text, nullable) - Additional notes
      - `screenshot_url` (text, nullable) - URL to screenshot
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `trades` table
    - Add policies for authenticated users to manage their own trades
*/

CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  pair text NOT NULL,
  entry_price decimal(10,5) NOT NULL,
  stop_loss decimal(10,5) NOT NULL,
  take_profit decimal(10,5) NOT NULL,
  rr_ratio decimal(5,2) NOT NULL,
  lot_size decimal(5,2),
  outcome decimal(10,2) NOT NULL,
  reason text NOT NULL,
  notes text,
  screenshot_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own trades"
  ON trades
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades"
  ON trades
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades"
  ON trades
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades"
  ON trades
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_date ON trades(date);
CREATE INDEX IF NOT EXISTS idx_trades_pair ON trades(pair);