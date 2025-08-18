/*
  # Create challenge settings table

  1. New Tables
    - `challenge_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `starting_amount` (decimal) - Custom starting amount
      - `risk_percentage` (decimal) - Risk percentage per trade
      - `reward_ratio` (decimal) - Risk to reward ratio
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `challenge_settings` table
    - Add policies for authenticated users to manage their own settings
    - Add unique constraint to ensure one setting per user

  3. Indexes
    - Add index on user_id for fast lookups
*/

CREATE TABLE IF NOT EXISTS challenge_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  starting_amount numeric(10,2) NOT NULL DEFAULT 100.00 CHECK (starting_amount >= 10 AND starting_amount <= 100000),
  risk_percentage numeric(5,2) NOT NULL DEFAULT 2.00 CHECK (risk_percentage >= 0.1 AND risk_percentage <= 50),
  reward_ratio numeric(5,2) NOT NULL DEFAULT 2.00 CHECK (reward_ratio >= 1 AND reward_ratio <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE challenge_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own challenge settings"
  ON challenge_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge settings"
  ON challenge_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge settings"
  ON challenge_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenge settings"
  ON challenge_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_challenge_settings_user_id 
  ON challenge_settings(user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_challenge_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_challenge_settings_updated_at
  BEFORE UPDATE ON challenge_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_challenge_settings_updated_at();