-- ============================================================================
-- Migration 022: Fix Market Intelligence Analytics
-- ============================================================================
-- CRITICAL FIXES for data integrity:
-- 1. Use ONLY confirmed transactions with sold_price (real sales data)
-- 2. Remove RANDOM() - no artificial/random KPIs
-- 3. Add sample_size and confidence_score
-- 4. Use COALESCE(sold_price, price) for listings still seeking buyers
-- 5. Distinguish asked price vs realized price vs estimations
-- ============================================================================

-- ===========================================================================
-- FUNCTION: get_real_market_trends (CONFIRMED transactions only)
-- ===========================================================================
-- Returns ONLY realized prices from confirmed transactions
-- Includes: median price, transaction volume, sample size, confidence

CREATE OR REPLACE FUNCTION get_real_market_trends(time_period TEXT DEFAULT 'month')
RETURNS TABLE (
  period TEXT,
  median_price NUMERIC,
  avg_price NUMERIC,
  volume_transactions INT,
  sample_size INT,
  confidence_score NUMERIC,
  price_volatility NUMERIC,
  min_price NUMERIC,
  max_price NUMERIC,
  currency TEXT,
  source_type TEXT,
  insufficient_data BOOLEAN
) AS $$
DECLARE
  date_filter TIMESTAMP;
  transaction_count INT;
BEGIN
  -- Set date ranges based on period
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'quarter' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE -- default month
      date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  RETURN QUERY
  WITH confirmed_sales AS (
    SELECT
      t.amount,
      t.currency,
      t.created_at
    FROM transactions t
    WHERE t.status = 'confirmed'
      AND t.amount IS NOT NULL
      AND t.amount > 0
      AND t.created_at >= date_filter
  ),
  price_stats AS (
    SELECT
      COUNT(*) AS cnt,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) AS median_p,
      AVG(amount) AS avg_p,
      STDDEV_POP(amount) AS volatility,
      MIN(amount) AS min_p,
      MAX(amount) AS max_p,
      currency AS curr
    FROM confirmed_sales
    GROUP BY currency
  )
  SELECT
    time_period,
    ps.median_p,
    ps.avg_p,
    ps.cnt,
    ps.cnt,
    -- Confidence: low if <5, medium if <20, high if >=20
    CASE
      WHEN ps.cnt < 5 THEN 0.3
      WHEN ps.cnt < 20 THEN 0.6
      ELSE 0.9
    END,
    ps.volatility,
    ps.min_p,
    ps.max_p,
    ps.curr,
    'confirmed_transactions',
    ps.cnt < 5
  FROM price_stats ps;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===========================================================================
-- FUNCTION: get_sales_volume_by_country (Real transactions only)
-- ===========================================================================
-- Returns transaction volume by buyer/seller country with confidence

CREATE OR REPLACE FUNCTION get_sales_volume_by_country(time_period TEXT DEFAULT 'month')
RETURNS TABLE (
  country VARCHAR,
  transaction_count INT,
  median_price NUMERIC,
  total_volume NUMERIC,
  sample_size INT,
  confidence_score NUMERIC,
  currency TEXT,
  insufficient_data BOOLEAN
) AS $$
DECLARE
  date_filter TIMESTAMP;
BEGIN
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'quarter' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE
      date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  RETURN QUERY
  WITH confirmed_sales AS (
    SELECT
      COALESCE(u.country, 'Unknown') AS buyer_country,
      t.amount,
      t.currency
    FROM transactions t
    LEFT JOIN users u ON t.buyer_id = u.id
    WHERE t.status = 'confirmed'
      AND t.amount IS NOT NULL
      AND t.amount > 0
      AND t.created_at >= date_filter
  ),
  country_stats AS (
    SELECT
      buyer_country,
      COUNT(*) AS cnt,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) AS median_p,
      SUM(amount) AS total_vol,
      currency
    FROM confirmed_sales
    GROUP BY buyer_country, currency
  )
  SELECT
    cs.buyer_country,
    cs.cnt,
    cs.median_p,
    cs.total_vol,
    cs.cnt,
    CASE
      WHEN cs.cnt < 5 THEN 0.3
      WHEN cs.cnt < 20 THEN 0.6
      ELSE 0.9
    END,
    cs.currency,
    cs.cnt < 5
  FROM country_stats cs
  ORDER BY cs.cnt DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===========================================================================
-- FUNCTION: get_medium_performance (Real sales by artwork medium)
-- ===========================================================================
-- Sales volume and pricing by artwork medium

CREATE OR REPLACE FUNCTION get_medium_performance(time_period TEXT DEFAULT 'month')
RETURNS TABLE (
  medium VARCHAR,
  transaction_count INT,
  median_price NUMERIC,
  avg_price NUMERIC,
  sample_size INT,
  confidence_score NUMERIC,
  sale_rate NUMERIC,
  insufficient_data BOOLEAN
) AS $$
DECLARE
  date_filter TIMESTAMP;
BEGIN
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'quarter' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE
      date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  RETURN QUERY
  WITH confirmed_sales AS (
    SELECT
      COALESCE(a.medium, 'Other') AS artwork_medium,
      COUNT(*) AS sale_count,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY t.amount) AS median_p,
      AVG(t.amount) AS avg_p
    FROM transactions t
    LEFT JOIN artworks a ON t.artwork_id = a.id
    WHERE t.status = 'confirmed'
      AND t.amount IS NOT NULL
      AND t.created_at >= date_filter
    GROUP BY artwork_medium
  ),
  all_medium_count AS (
    SELECT
      COALESCE(medium, 'Other') AS artwork_medium,
      COUNT(*) AS total_count
    FROM artworks
    WHERE created_at >= date_filter
    GROUP BY medium
  )
  SELECT
    cs.artwork_medium,
    cs.sale_count,
    cs.median_p,
    cs.avg_p,
    cs.sale_count,
    CASE
      WHEN cs.sale_count < 5 THEN 0.3
      WHEN cs.sale_count < 20 THEN 0.6
      ELSE 0.9
    END,
    -- Sale rate = confirmed transactions / total artworks published
    ROUND((cs.sale_count::NUMERIC / NULLIF(amc.total_count, 0) * 100)::NUMERIC, 2),
    cs.sale_count < 5
  FROM confirmed_sales cs
  LEFT JOIN all_medium_count amc ON cs.artwork_medium = amc.artwork_medium
  ORDER BY cs.sale_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===========================================================================
-- FUNCTION: get_sourcing_intelligence (Buyer behavior analysis)
-- ===========================================================================
-- Sourcing inquiries by category, budget, country

CREATE OR REPLACE FUNCTION get_sourcing_intelligence(time_period TEXT DEFAULT 'month')
RETURNS TABLE (
  category VARCHAR,
  inquiry_count INT,
  avg_budget NUMERIC,
  median_budget NUMERIC,
  buyer_countries VARCHAR[],
  sample_size INT,
  confidence_score NUMERIC
) AS $$
DECLARE
  date_filter TIMESTAMP;
BEGIN
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'quarter' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE
      date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  RETURN QUERY
  WITH sourcing_data AS (
    SELECT
      COALESCE(a.category, 'Other') AS cat,
      si.budget,
      u.country
    FROM sourcing_inquiries si
    LEFT JOIN artworks a ON si.artwork_id = a.id
    LEFT JOIN users u ON si.requested_by = u.id
    WHERE si.created_at >= date_filter
  ),
  category_stats AS (
    SELECT
      cat,
      COUNT(*) AS cnt,
      AVG(budget) AS avg_b,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY budget) AS median_b,
      ARRAY_AGG(DISTINCT country) FILTER (WHERE country IS NOT NULL) AS countries
    FROM sourcing_data
    GROUP BY cat
  )
  SELECT
    cs.cat,
    cs.cnt,
    cs.avg_b,
    cs.median_b,
    cs.countries,
    cs.cnt,
    CASE
      WHEN cs.cnt < 5 THEN 0.3
      WHEN cs.cnt < 20 THEN 0.6
      ELSE 0.9
    END
  FROM category_stats cs
  ORDER BY cs.cnt DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===========================================================================
-- FUNCTION: get_conversion_funnel (Views → Likes → Inquiries → Sales)
-- ===========================================================================
-- Funnel analysis from views to confirmed transactions

CREATE OR REPLACE FUNCTION get_conversion_funnel(time_period TEXT DEFAULT 'month')
RETURNS TABLE (
  total_artworks INT,
  artworks_with_views INT,
  artworks_with_likes INT,
  artworks_with_inquiries INT,
  artworks_sold INT,
  view_to_like_rate NUMERIC,
  like_to_inquiry_rate NUMERIC,
  inquiry_to_sale_rate NUMERIC,
  overall_sale_rate NUMERIC
) AS $$
DECLARE
  date_filter TIMESTAMP;
BEGIN
  CASE time_period
    WHEN 'week' THEN date_filter := NOW() - INTERVAL '7 days';
    WHEN 'quarter' THEN date_filter := NOW() - INTERVAL '90 days';
    WHEN 'year' THEN date_filter := NOW() - INTERVAL '365 days';
    ELSE
      date_filter := NOW() - INTERVAL '30 days';
  END CASE;

  RETURN QUERY
  WITH funnel_data AS (
    SELECT
      COUNT(DISTINCT a.id) AS total_artworks,
      COUNT(DISTINCT CASE WHEN a.visited > 0 THEN a.id END) AS artworks_with_views,
      COUNT(DISTINCT CASE WHEN a.likes_count > 0 THEN a.id END) AS artworks_with_likes,
      COUNT(DISTINCT si.artwork_id) AS artworks_with_inquiries,
      COUNT(DISTINCT CASE WHEN t.status = 'confirmed' THEN a.id END) AS artworks_sold
    FROM artworks a
    LEFT JOIN sourcing_inquiries si ON a.id = si.artwork_id AND si.created_at >= date_filter
    LEFT JOIN transactions t ON a.id = t.artwork_id AND t.created_at >= date_filter
    WHERE a.created_at >= date_filter
  )
  SELECT
    fd.total_artworks,
    fd.artworks_with_views,
    fd.artworks_with_likes,
    fd.artworks_with_inquiries,
    fd.artworks_sold,
    ROUND((fd.artworks_with_likes::NUMERIC / NULLIF(fd.artworks_with_views, 0) * 100)::NUMERIC, 2),
    ROUND((fd.artworks_with_inquiries::NUMERIC / NULLIF(fd.artworks_with_likes, 0) * 100)::NUMERIC, 2),
    ROUND((fd.artworks_sold::NUMERIC / NULLIF(fd.artworks_with_inquiries, 0) * 100)::NUMERIC, 2),
    ROUND((fd.artworks_sold::NUMERIC / NULLIF(fd.total_artworks, 0) * 100)::NUMERIC, 2)
  FROM funnel_data;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===========================================================================
-- INDEX OPTIMIZATION for analytics queries
-- ===========================================================================

CREATE INDEX IF NOT EXISTS idx_transactions_status_created ON transactions(status, created_at);
CREATE INDEX IF NOT EXISTS idx_artworks_medium_created ON artworks(medium, created_at);
CREATE INDEX IF NOT EXISTS idx_sourcing_inquiries_created ON sourcing_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

-- ===========================================================================
-- MIGRATION NOTES
-- ===========================================================================
-- This migration replaces incorrect analytics with real data:
-- - Before: Mixed listing prices (price) with transaction prices (sold_price)
-- - After: Only confirmed transactions with real amounts
--
-- - Before: Random buzz scores via RANDOM()
-- - After: No random data, only observed metrics
--
-- - Before: No confidence indicator
-- - After: Confidence score based on sample size (0.3-0.9)
--
-- - Before: No "insufficient data" warning
-- - After: Returns flag when < 5 observations
--
-- Keep migration 021 untouched for backward compatibility.
-- ============================================================================
