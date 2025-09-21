/*
  # Add trading enhancements - Before/After images and Trading Steps

  1. New Columns
    - `before_image` (text) - URL or base64 data for before entry image
    - `after_image` (text) - URL or base64 data for after exit image  
    - `trading_steps` (text) - JSON string containing steps and completion status

  2. Indexes
    - Add indexes for better query performance on new columns

  3. Security
    - RLS policies already exist for trades table
*/

-- Add new columns to trades table
DO $$
BEGIN
  -- Add before_image column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'trades' AND column_name = 'before_image'
  ) THEN
    ALTER TABLE trades ADD COLUMN before_image text;
  END IF;

  -- Add after_image column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'trades' AND column_name = 'after_image'
  ) THEN
    ALTER TABLE trades ADD COLUMN after_image text;
  END IF;

  -- Add trading_steps column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'trades' AND column_name = 'trading_steps'
  ) THEN
    ALTER TABLE trades ADD COLUMN trading_steps text;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trades_before_image ON trades(before_image) WHERE before_image IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trades_after_image ON trades(after_image) WHERE after_image IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trades_trading_steps ON trades(trading_steps) WHERE trading_steps IS NOT NULL;