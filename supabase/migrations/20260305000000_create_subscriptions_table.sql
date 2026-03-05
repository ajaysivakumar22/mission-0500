-- Create the user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('pro', 'team')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_customer_id TEXT,
    payment_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id) -- One active subscription per user for now
);

-- Note: RLS is enabled, but we generally want to bypass it using Service Role for webhook updates.
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own subscription
CREATE POLICY "Users can read own subscription"
    ON public.user_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Setup trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
