/*
  # Fix RLS Performance Issues for Trading Setups
  
  1. Security Improvements
    - Replace direct auth.uid() calls with (select auth.uid()) to cache the value
    - This improves performance by evaluating auth.uid() once per query instead of per row
  
  2. Index Cleanup
    - Drop unused indexes on trading_setups table
    - Indexes were already covering queries through primary key
*/

DROP POLICY IF EXISTS "Users can view own setups" ON trading_setups;
DROP POLICY IF EXISTS "Users can insert own setups" ON trading_setups;
DROP POLICY IF EXISTS "Users can update own setups" ON trading_setups;
DROP POLICY IF EXISTS "Users can delete own setups" ON trading_setups;

CREATE POLICY "Users can view own setups"
  ON trading_setups FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own setups"
  ON trading_setups FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own setups"
  ON trading_setups FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own setups"
  ON trading_setups FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view their setup steps" ON trading_setup_steps;
DROP POLICY IF EXISTS "Users can create setup steps for their setups" ON trading_setup_steps;
DROP POLICY IF EXISTS "Users can update their setup steps" ON trading_setup_steps;
DROP POLICY IF EXISTS "Users can delete their setup steps" ON trading_setup_steps;

CREATE POLICY "Users can view their setup steps"
  ON trading_setup_steps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trading_setups
      WHERE trading_setups.id = trading_setup_steps.setup_id
      AND trading_setups.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create setup steps for their setups"
  ON trading_setup_steps FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_setups
      WHERE trading_setups.id = trading_setup_steps.setup_id
      AND trading_setups.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update their setup steps"
  ON trading_setup_steps FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trading_setups
      WHERE trading_setups.id = trading_setup_steps.setup_id
      AND trading_setups.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trading_setups
      WHERE trading_setups.id = trading_setup_steps.setup_id
      AND trading_setups.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete their setup steps"
  ON trading_setup_steps FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trading_setups
      WHERE trading_setups.id = trading_setup_steps.setup_id
      AND trading_setups.user_id = (select auth.uid())
    )
  );

DROP INDEX IF EXISTS idx_trading_setups_user_id;
DROP INDEX IF EXISTS idx_trading_setups_is_default;
