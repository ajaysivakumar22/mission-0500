-- Fix overly-permissive RLS policy on user_medals
-- The "Service role can manage all medals" policy used FOR ALL USING (true)
-- which allowed ANY authenticated user to insert/update/delete ANY user's medals.
-- The service role (supabaseAdmin) already bypasses RLS, so this policy is unnecessary.

DROP POLICY IF EXISTS "Service role can manage all medals" ON public.user_medals;

-- Users should only be able to view their own medals (already exists)
-- Medal awarding is done via supabaseAdmin which bypasses RLS
