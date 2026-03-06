-- Migration: Add performance indexes
-- Run this in Supabase SQL Editor

-- Index for xp_records lookups by user + related_date (used by penalty dedup and heatmap)
CREATE INDEX IF NOT EXISTS idx_xp_records_user_related_date ON xp_records(user_id, related_date);

-- Index for xp_records lookups by reason (used by penalty dedup exact match)
CREATE INDEX IF NOT EXISTS idx_xp_records_reason ON xp_records(user_id, reason, related_date);
