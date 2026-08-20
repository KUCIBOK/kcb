-- ============================================================================
-- Migration 019: Add Budget Tracking System
-- ============================================================================
-- Allows curators (PLAN_PREMIUM) to track budgets and expenses
-- Tables: budget_records, budget_lines
-- RLS: User-scoped access only

-- ============================================================================
-- TABLE: budget_records
-- ============================================================================
-- Parent table for each curator's budget session
-- One record per user per budget cycle (typically per acquisition year/season)

CREATE TABLE IF NOT EXISTS budget_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount > 0),
  currency VARCHAR(3) NOT NULL CHECK (currency IN ('EUR', 'GBP', 'USD', 'XOF')),
  spent DECIMAL(12, 2) DEFAULT 0 CHECK (spent >= 0),
  allocated DECIMAL(12, 2) DEFAULT 0 CHECK (allocated >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT budget_records_user_id_idx UNIQUE (user_id, created_at)
);

-- ============================================================================
-- TABLE: budget_lines
-- ============================================================================
-- Individual budget line items (categories within a budget record)
-- Examples: "Acquisitions", "Shipping", "Framing", "Insurance", etc.

CREATE TABLE IF NOT EXISTS budget_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budget_records(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  allocated DECIMAL(12, 2) NOT NULL CHECK (allocated >= 0),
  spent DECIMAL(12, 2) DEFAULT 0 CHECK (spent >= 0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TABLE: budget_transactions
-- ============================================================================
-- Individual transactions logged against a budget
-- For audit trail and detailed tracking

CREATE TABLE IF NOT EXISTS budget_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES public.budget_records(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  transaction_date DATE NOT NULL,
  category VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_budget_records_user_id ON budget_records(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_records_status ON budget_records(status);
CREATE INDEX IF NOT EXISTS idx_budget_lines_budget_id ON budget_lines(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_budget_id ON budget_transactions(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_date ON budget_transactions(transaction_date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE budget_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own budgets
DROP POLICY IF EXISTS budget_records_select_policy ON budget_records;
CREATE POLICY budget_records_select_policy ON budget_records
  FOR SELECT USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS budget_records_insert_policy ON budget_records;
CREATE POLICY budget_records_insert_policy ON budget_records
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS budget_records_update_policy ON budget_records;
CREATE POLICY budget_records_update_policy ON budget_records
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS budget_records_delete_policy ON budget_records;
CREATE POLICY budget_records_delete_policy ON budget_records
  FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- Budget lines inherited from parent budget
DROP POLICY IF EXISTS budget_lines_select_policy ON budget_lines;
CREATE POLICY budget_lines_select_policy ON budget_lines
  FOR SELECT USING (
    budget_id IN (SELECT id FROM budget_records WHERE user_id = auth.uid())
    OR is_admin()
  );

DROP POLICY IF EXISTS budget_lines_insert_policy ON budget_lines;
CREATE POLICY budget_lines_insert_policy ON budget_lines
  FOR INSERT WITH CHECK (
    budget_id IN (SELECT id FROM budget_records WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS budget_lines_update_policy ON budget_lines;
CREATE POLICY budget_lines_update_policy ON budget_lines
  FOR UPDATE USING (
    budget_id IN (SELECT id FROM budget_records WHERE user_id = auth.uid())
    OR is_admin()
  );

DROP POLICY IF EXISTS budget_lines_delete_policy ON budget_lines;
CREATE POLICY budget_lines_delete_policy ON budget_lines
  FOR DELETE USING (
    budget_id IN (SELECT id FROM budget_records WHERE user_id = auth.uid())
    OR is_admin()
  );

-- Transactions
DROP POLICY IF EXISTS budget_transactions_select_policy ON budget_transactions;
CREATE POLICY budget_transactions_select_policy ON budget_transactions
  FOR SELECT USING (
    budget_id IN (SELECT id FROM budget_records WHERE user_id = auth.uid())
    OR is_admin()
  );

DROP POLICY IF EXISTS budget_transactions_insert_policy ON budget_transactions;
CREATE POLICY budget_transactions_insert_policy ON budget_transactions
  FOR INSERT WITH CHECK (
    budget_id IN (SELECT id FROM budget_records WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS budget_transactions_delete_policy ON budget_transactions;
CREATE POLICY budget_transactions_delete_policy ON budget_transactions
  FOR DELETE USING (
    budget_id IN (SELECT id FROM budget_records WHERE user_id = auth.uid())
    OR is_admin()
  );

-- ============================================================================
-- FUNCTION & TRIGGER: auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS budget_records_updated_at ON budget_records;
CREATE TRIGGER budget_records_updated_at
  BEFORE UPDATE ON budget_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS budget_lines_updated_at ON budget_lines;
CREATE TRIGGER budget_lines_updated_at
  BEFORE UPDATE ON budget_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
