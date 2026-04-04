-- Add category column to daily_routines
ALTER TABLE daily_routines ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'routine';
CREATE INDEX IF NOT EXISTS idx_daily_routines_category ON daily_routines(category);
