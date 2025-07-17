/*
  # Create challenge_trades table for Compounding Challenge feature

  1. New Tables
    - `challenge_trades`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `trade_number` (integer, sequential trade number)
      - `starting_balance` (decimal, balance before trade)
      - `risk_amount` (decimal, 5% of starting balance)
      - `target_profit` (decimal, 2x risk amount)
      - `result` (text, 'win' or 'loss')
      - `final_balance` (decimal, balance after trade)
      - `notes` (text, optional trade notes)
      - `screenshot_url` (text, optional image URL)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `challenge_trades` table
    - Add policies for authenticated users to manage their own challenge trades

  3. Indexes
    - Index on user_id for performance
    - Index on trade_number for ordering
*/

CREATE TABLE IF NOT EXISTS challenge_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_number integer NOT NULL,
  starting_balance numeric(10,2) NOT NULL,
  risk_amount numeric(10,2) NOT NULL,
  target_profit numeric(10,2) NOT NULL,
  result text NOT NULL CHECK (result IN ('win', 'loss')),
  final_balance numeric(10,2) NOT NULL,
  notes text,
  screenshot_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE challenge_trades ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own challenge trades"
  ON challenge_trades
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge trades"
  ON challenge_trades
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge trades"
  ON challenge_trades
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenge trades"
  ON challenge_trades
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_challenge_trades_user_id ON challenge_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_trades_trade_number ON challenge_trades(user_id, trade_number);
CREATE INDEX IF NOT EXISTS idx_challenge_trades_created_at ON challenge_trades(created_at);