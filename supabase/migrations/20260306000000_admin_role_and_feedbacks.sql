-- Migration: Add admin role support and user_feedbacks table
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. Add 'role' column to users table (defaults to 'user')
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- ============================================================================
-- 2. Create user_feedbacks table
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_feedbacks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe re-run)
DROP POLICY IF EXISTS "Users can insert own feedback" ON user_feedbacks;
DROP POLICY IF EXISTS "Users can read own feedback" ON user_feedbacks;
DROP POLICY IF EXISTS "Admins can read all feedbacks" ON user_feedbacks;
DROP POLICY IF EXISTS "Admins can update feedbacks" ON user_feedbacks;
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback" ON user_feedbacks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read their own feedback
CREATE POLICY "Users can read own feedback" ON user_feedbacks
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- 3. Add admin-bypass RLS policy on users table
--    Allows users with role='admin' to read ALL user rows
-- ============================================================================
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- ============================================================================
-- 4. Admin can read all feedbacks
-- ============================================================================
CREATE POLICY "Admins can read all feedbacks" ON user_feedbacks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- ============================================================================
-- 5. Admin can update feedback status
-- ============================================================================
CREATE POLICY "Admins can update feedbacks" ON user_feedbacks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );
