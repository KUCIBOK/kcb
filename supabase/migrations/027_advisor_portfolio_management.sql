-- ============================================================================
-- Migration 027: Advisor Portfolio Management
-- ============================================================================
-- Tables for advisor holdings, valuations, and historical tracking
-- ============================================================================

-- 1. Advisor Holdings (Current Portfolio)
CREATE TABLE IF NOT EXISTS advisor_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  purchase_date TIMESTAMP DEFAULT NOW(),
  purchase_price NUMERIC,
  quantity INTEGER DEFAULT 1,
  acquisition_cost NUMERIC, -- Total cost (purchase_price * quantity)
  current_valuation NUMERIC, -- Latest valuation
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(advisor_id, artwork_id)
);

CREATE INDEX idx_advisor_holdings_advisor ON advisor_holdings(advisor_id);
CREATE INDEX idx_advisor_holdings_artwork ON advisor_holdings(artwork_id);

-- 2. Portfolio Snapshots (Historical Tracking)
CREATE TABLE IF NOT EXISTS advisor_portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date TIMESTAMP DEFAULT NOW(),
  total_value NUMERIC,
  total_cost NUMERIC,
  realized_gains NUMERIC,
  unrealized_gains NUMERIC,
  yoy_growth NUMERIC,
  holdings_count INTEGER,
  best_performer_artwork_id UUID,
  worst_performer_artwork_id UUID,
  avg_holding_days NUMERIC,
  diversity_score NUMERIC, -- 0-100
  risk_score NUMERIC, -- 0-100
  metadata JSONB, -- Additional metrics
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_portfolio_snapshots_advisor ON advisor_portfolio_snapshots(advisor_id);
CREATE INDEX idx_portfolio_snapshots_date ON advisor_portfolio_snapshots(snapshot_date);

-- 3. Artist Valuation History (For Trends)
CREATE TABLE IF NOT EXISTS artist_valuation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  valuation_date TIMESTAMP DEFAULT NOW(),
  median_price NUMERIC, -- Market median for this artist
  avg_price NUMERIC,
  min_price NUMERIC,
  max_price NUMERIC,
  sales_count INTEGER, -- Number of sales in period
  demand_score NUMERIC, -- 0-100 (calculated from sales trends)
  rarity_index NUMERIC, -- 0-100 (based on supply)
  reputation_score NUMERIC, -- 0-100 (from artist table)
  trend_direction TEXT, -- 'up', 'down', 'stable'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_valuation_history_artist ON artist_valuation_history(artist_id);
CREATE INDEX idx_valuation_history_date ON artist_valuation_history(valuation_date);

-- 4. Portfolio Transaction Events (For Analytics)
CREATE TABLE IF NOT EXISTS portfolio_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT, -- 'purchase', 'sale', 'revaluation', 'split'
  artwork_id UUID REFERENCES artworks(id),
  price_before NUMERIC,
  price_after NUMERIC,
  quantity_change INTEGER,
  event_date TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_portfolio_events_advisor ON portfolio_events(advisor_id);
CREATE INDEX idx_portfolio_events_date ON portfolio_events(event_date);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Calculate advisor portfolio metrics
CREATE OR REPLACE FUNCTION calculate_advisor_portfolio_metrics(p_advisor_id UUID)
RETURNS TABLE (
  total_value NUMERIC,
  total_cost NUMERIC,
  realized_gains NUMERIC,
  unrealized_gains NUMERIC,
  yoy_growth NUMERIC,
  holdings_count INTEGER,
  best_performer TEXT,
  worst_performer TEXT,
  diversity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(ah.current_valuation), 0)::NUMERIC as total_value,
    COALESCE(SUM(ah.acquisition_cost), 0)::NUMERIC as total_cost,
    0::NUMERIC as realized_gains, -- From sold items
    (COALESCE(SUM(ah.current_valuation), 0) - COALESCE(SUM(ah.acquisition_cost), 0))::NUMERIC as unrealized_gains,
    ((COALESCE(SUM(ah.current_valuation), 0) - COALESCE(SUM(ah.acquisition_cost), 0)) / NULLIF(COALESCE(SUM(ah.acquisition_cost), 0), 0) * 100)::NUMERIC as yoy_growth,
    COUNT(*)::INTEGER as holdings_count,
    ''::TEXT as best_performer,
    ''::TEXT as worst_performer,
    (COUNT(DISTINCT ah.artwork_id)::NUMERIC / NULLIF(COUNT(*), 0) * 100)::NUMERIC as diversity_score
  FROM advisor_holdings ah
  WHERE ah.advisor_id = p_advisor_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- NOTES:
-- - advisor_holdings: Current portfolio (what advisor owns)
-- - advisor_portfolio_snapshots: Daily/weekly snapshots for historical tracking
-- - artist_valuation_history: Track artist valuations over time
-- - portfolio_events: Log all changes for audit trail
-- - calculate_advisor_portfolio_metrics: Function to compute portfolio stats
-- ============================================================================
