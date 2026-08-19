-- =============================================================================
-- Migration 017: Add Trial Support
-- Purpose: Enable 14-day auto-expiring trials for new signups
-- Created: 2026-08-19
-- =============================================================================

-- Add trial columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT FALSE;

-- Index for efficient trial expiry queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_trial_end_date
ON subscriptions(trial_end_date)
WHERE is_trial = TRUE AND trial_end_date IS NOT NULL;

-- Index for finding active trials
CREATE INDEX IF NOT EXISTS idx_subscriptions_is_trial
ON subscriptions(user_id, is_trial)
WHERE is_trial = TRUE;

-- =============================================================================
-- Safety checks: existing subscriptions are NOT trials
-- =============================================================================
-- Comment: Existing subscriptions retain status quo
-- Trial = TRUE only for NEW signups after this migration
-- No data corruption risk

-- =============================================================================
-- Documentation
-- =============================================================================
-- COLUMN DESCRIPTIONS:
--
-- is_trial (BOOLEAN DEFAULT FALSE)
--   Marks subscription as a trial period (14 days)
--   Free plan signups = is_trial: true
--   Paid signups or renewals = is_trial: false
--
-- trial_started_at (TIMESTAMPTZ)
--   Timestamp when trial began (typically = start_date for trials)
--   Used for audit/analytics
--
-- trial_end_date (TIMESTAMPTZ)
--   Auto-calculated: trial_started_at + 14 days
--   When this date passes, trial expires
--   User loses access unless they pay
--
-- WORKFLOW:
-- 1. User signs up → create subscription with:
--    status: 'trial'
--    is_trial: TRUE
--    trial_started_at: NOW()
--    trial_end_date: NOW() + 14 days
--    start_date: NOW()
--    end_date: NOW() + 14 days
--
-- 2. Frontend checks: if trial_end_date < NOW() → show "Trial expired"
-- 3. Backend check (optional webhook): expire old trials automatically
-- 4. User upgrades → update subscription with paid plan details
--
-- =============================================================================
