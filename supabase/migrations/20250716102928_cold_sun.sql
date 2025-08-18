/*
  # Add trade type column to trades table

  1. Changes
    - Add `trade_type` column to `trades` table
    - Set default value to 'buy' for existing records
    - Add check constraint to ensure only 'buy' or 'sell' values

  2. Security
    - No changes to RLS policies needed
*/

-- Add trade_type column to trades table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trades' AND column_name = 'trade_type'
  ) THEN
    ALTER TABLE trades ADD COLUMN trade_type text DEFAULT 'buy';
    
    -- Add check constraint to ensure only 'buy' or 'sell' values
    ALTER TABLE trades ADD CONSTRAINT trades_trade_type_check 
    CHECK (trade_type IN ('buy', 'sell'));
  END IF;
END $$;