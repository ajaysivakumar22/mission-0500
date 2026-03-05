import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getUserSettings } from '@/server/actions/settings';
import OnboardingClient from './OnboardingClient';

export default async function OnboardingPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const { data: userSettings } = await getUserSettings(session.user.id);
    if (userSettings && userSettings.onboarding_completed) {
        redirect('/dashboard');
    }

    return <OnboardingClient userId={session.user.id} />;
}