-- =============================================================================
-- 013_transactions_guest_buyer_fields.sql
--
-- Adds guest buyer contact fields to public.transactions so a checkout can
-- complete without forcing the buyer to create an account. PayDunya already
-- collects name / email / phone on its checkout page; we capture those values
-- in the IPN callback and store them here for delivery, receipts, and admin
-- follow-up.
--
-- buyer_id stays nullable for guests. Authenticated buyers continue to have
-- buyer_id set; guest buyers get buyer_id = NULL plus the three new fields.
-- =============================================================================

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS buyer_email TEXT,
  ADD COLUMN IF NOT EXISTS buyer_phone TEXT,
  ADD COLUMN IF NOT EXISTS buyer_name  TEXT;

CREATE INDEX IF NOT EXISTS idx_transactions_buyer_email
  ON public.transactions (buyer_email)
  WHERE buyer_email IS NOT NULL;
