-- Fix overly-permissive RLS policy on user_settings
-- The "Service role can manage all settings" policy used FOR ALL USING (true)
-- which allowed ANY authenticated user to read/modify ANY user's settings
-- via the anon key. The service role (supabaseAdmin) already bypasses RLS.

DROP POLICY IF EXISTS "Service role can manage all settings" ON public.user_settings;
