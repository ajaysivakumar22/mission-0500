-- Create user_medals table for tracking earned commendations

CREATE TABLE IF NOT EXISTS public.user_medals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    medal_id TEXT NOT NULL,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, medal_id)
);

-- Enable RLS
ALTER TABLE public.user_medals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own medals"
    ON public.user_medals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all medals"
    ON public.user_medals FOR ALL
    USING (true)
    WITH CHECK (true);
