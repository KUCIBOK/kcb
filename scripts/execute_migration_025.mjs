#!/usr/bin/env node

import pkg from 'pg'
const { Client } = pkg

const client = new Client({
  host: 'wyrmpddlhldjzoiwbshj.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'kcbkucibok123',
  ssl: { rejectUnauthorized: false }
})

console.log('\n🚀 Connecting to Supabase PostgreSQL...\n')

try {
  await client.connect()
  console.log('✅ Connected!\n')

  // Execute migration 025 statements
  const statements = [
    `CREATE OR REPLACE FUNCTION get_sales_volume_by_country(time_period TEXT DEFAULT 'month')
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
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount)::NUMERIC AS median_p,
      SUM(amount)::NUMERIC AS total_vol,
      currency
    FROM confirmed_sales
    GROUP BY buyer_country, currency
  )
  SELECT
    cs.buyer_country::VARCHAR,
    cs.cnt::INT,
    cs.median_p::NUMERIC,
    cs.total_vol::NUMERIC,
    cs.cnt::INT,
    (CASE WHEN cs.cnt < 5 THEN 0.3::NUMERIC WHEN cs.cnt < 20 THEN 0.6::NUMERIC ELSE 0.9::NUMERIC END)::NUMERIC,
    cs.currency::TEXT,
    (cs.cnt < 5)::BOOLEAN
  FROM country_stats cs
  ORDER BY cs.cnt DESC;
END;
$$ LANGUAGE plpgsql STABLE;`,

    `CREATE OR REPLACE FUNCTION get_medium_performance(time_period TEXT DEFAULT 'month')
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
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY t.amount)::NUMERIC AS median_p,
      AVG(t.amount)::NUMERIC AS avg_p
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
    cs.artwork_medium::VARCHAR,
    cs.sale_count::INT,
    cs.median_p::NUMERIC,
    cs.avg_p::NUMERIC,
    cs.sale_count::INT,
    (CASE WHEN cs.sale_count < 5 THEN 0.3::NUMERIC WHEN cs.sale_count < 20 THEN 0.6::NUMERIC ELSE 0.9::NUMERIC END)::NUMERIC,
    ROUND((cs.sale_count::NUMERIC / NULLIF(amc.total_count, 0) * 100)::NUMERIC, 2)::NUMERIC,
    (cs.sale_count < 5)::BOOLEAN
  FROM confirmed_sales cs
  LEFT JOIN all_medium_count amc ON cs.artwork_medium = amc.artwork_medium
  ORDER BY cs.sale_count DESC;
END;
$$ LANGUAGE plpgsql STABLE;`,

    `CREATE OR REPLACE FUNCTION get_conversion_funnel(time_period TEXT DEFAULT 'month')
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
    LEFT JOIN transactions t ON a.id = t.artwork_id AND t.created_at >= date_filter AND t.status = 'confirmed'
    WHERE a.created_at >= date_filter
  )
  SELECT
    fd.total_artworks::INT,
    fd.artworks_with_views::INT,
    fd.artworks_with_likes::INT,
    fd.artworks_with_inquiries::INT,
    fd.artworks_sold::INT,
    ROUND((fd.artworks_with_likes::NUMERIC / NULLIF(fd.artworks_with_views, 0) * 100)::NUMERIC, 2)::NUMERIC,
    ROUND((fd.artworks_with_inquiries::NUMERIC / NULLIF(fd.artworks_with_likes, 0) * 100)::NUMERIC, 2)::NUMERIC,
    ROUND((fd.artworks_sold::NUMERIC / NULLIF(fd.artworks_with_inquiries, 0) * 100)::NUMERIC, 2)::NUMERIC,
    ROUND((fd.artworks_sold::NUMERIC / NULLIF(fd.total_artworks, 0) * 100)::NUMERIC, 2)::NUMERIC
  FROM funnel_data AS fd;
END;
$$ LANGUAGE plpgsql STABLE;`
  ]

  console.log(`📝 Executing ${statements.length} SQL statements...\n`)

  for (let i = 0; i < statements.length; i++) {
    try {
      await client.query(statements[i])
      console.log(`✅ Statement ${i + 1}/${statements.length}: Function created/updated`)
    } catch (err) {
      console.error(`❌ Statement ${i + 1}: ${err.message}`)
    }
  }

  console.log('\n✨ Migration 025 Complete!\n')

  await client.end()
  process.exit(0)

} catch (err) {
  console.error('❌ Error:', err.message)
  process.exit(1)
}
