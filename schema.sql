-- MISSION 0500 - Complete SQL Schema with RLS
-- Execute this in Supabase SQL Editor
-- Safe to re-run: drops everything first, then recreates

-- ============================================================================
-- CLEANUP: Drop tables in reverse dependency order (CASCADE removes triggers)
-- ============================================================================

DROP TABLE IF EXISTS xp_records CASCADE;
DROP TABLE IF EXISTS goal_logs CASCADE;
DROP TABLE IF EXISTS daily_reports CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS daily_routines CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS task_priority;
DROP TYPE IF EXISTS goal_category;

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE goal_category AS ENUM ('short_term', 'mid_term', 'long_term');

-- ============================================================================
-- USERS TABLE (extends Supabase auth)
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- GOALS TABLE (must be created BEFORE daily_tasks, which references it)
-- ============================================================================

CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category goal_category NOT NULL,
  target_date DATE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_goals_user_category ON goals(user_id, category);

CREATE POLICY "Users can manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- DAILY ROUTINES TABLE
-- ============================================================================

CREATE TABLE daily_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  routine_date DATE NOT NULL,
  item_name TEXT NOT NULL,
  item_order INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, routine_date, item_name)
);

ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_daily_routines_user_date ON daily_routines(user_id, routine_date);

CREATE POLICY "Users can manage own routines" ON daily_routines
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- DAILY TASKS TABLE (references goals table above)
-- ============================================================================

CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_daily_tasks_user_date ON daily_tasks(user_id, task_date);
CREATE INDEX idx_daily_tasks_goal ON daily_tasks(goal_id);

CREATE POLICY "Users can manage own tasks" ON daily_tasks
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- GOAL LOGS TABLE
-- ============================================================================

CREATE TABLE goal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  entry_text TEXT NOT NULL,
  progress_increment INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE goal_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_goal_logs_goal ON goal_logs(goal_id);
CREATE INDEX idx_goal_logs_user_date ON goal_logs(user_id, created_at);

CREATE POLICY "Users can manage own goal logs" ON goal_logs
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- DAILY REPORTS TABLE
-- ============================================================================

CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  accomplishments TEXT,
  failures TEXT,
  lessons_learned TEXT,
  discipline_score INTEGER CHECK (discipline_score >= 1 AND discipline_score <= 10),
  energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, report_date)
);

ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_daily_reports_user_date ON daily_reports(user_id, report_date);

CREATE POLICY "Users can manage own reports" ON daily_reports
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- XP RECORDS TABLE
-- ============================================================================

CREATE TABLE xp_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  related_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE xp_records ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_xp_records_user_date ON xp_records(user_id, created_at);

CREATE POLICY "Users can read own xp records" ON xp_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert xp records" ON xp_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER SETTINGS TABLE
-- ============================================================================

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  countdown_target TEXT,
  countdown_date DATE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  timezone TEXT DEFAULT 'UTC',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- STREAKS TABLE
-- ============================================================================

CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own streaks" ON streaks
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_total_xp(user_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(amount) FROM xp_records WHERE user_id = user_id_param),
    0
  );
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_user_rank(total_xp INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF total_xp < 500 THEN RETURN 'Cadet';
  ELSIF total_xp < 1500 THEN RETURN 'Senior Cadet';
  ELSIF total_xp < 3000 THEN RETURN 'Officer';
  ELSE RETURN 'Commander';
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_routine_completion_percentage(user_id_param UUID, target_date DATE)
RETURNS NUMERIC AS $$
DECLARE
  total_items INTEGER;
  completed_items INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_items
  FROM daily_routines
  WHERE user_id = user_id_param AND routine_date = target_date;

  IF total_items = 0 THEN RETURN 0; END IF;

  SELECT COUNT(*) INTO completed_items
  FROM daily_routines
  WHERE user_id = user_id_param AND routine_date = target_date AND is_completed = TRUE;

  RETURN ROUND((completed_items::NUMERIC / total_items::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_task_completion_percentage(user_id_param UUID, target_date DATE)
RETURNS NUMERIC AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_tasks
  FROM daily_tasks
  WHERE user_id = user_id_param AND task_date = target_date;

  IF total_tasks = 0 THEN RETURN 0; END IF;

  SELECT COUNT(*) INTO completed_tasks
  FROM daily_tasks
  WHERE user_id = user_id_param AND task_date = target_date AND is_completed = TRUE;

  RETURN ROUND((completed_tasks::NUMERIC / total_tasks::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_daily_completion_bonus_status(user_id_param UUID, target_date DATE)
RETURNS BOOLEAN AS $$
DECLARE
  total_items INTEGER;
  completed_items INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_items
  FROM daily_routines
  WHERE user_id = user_id_param AND routine_date = target_date;

  IF total_items = 0 THEN RETURN FALSE; END IF;

  SELECT COUNT(*) INTO completed_items
  FROM daily_routines
  WHERE user_id = user_id_param AND routine_date = target_date AND is_completed = TRUE;

  RETURN (completed_items = total_items AND total_items > 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  INSERT INTO streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_settings();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_daily_routines_updated_at BEFORE UPDATE ON daily_routines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_daily_tasks_updated_at BEFORE UPDATE ON daily_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_goal_logs_updated_at BEFORE UPDATE ON goal_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_daily_reports_updated_at BEFORE UPDATE ON daily_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
