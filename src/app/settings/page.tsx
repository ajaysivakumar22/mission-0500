import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';
import { getUserSettings } from '@/server/actions/settings';

export default async function SettingsPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const settingsResult = await getUserSettings(session.user.id);
    const initialStrictMode = settingsResult.success ? settingsResult.data?.strict_mode || false : false;
    const isPremium = settingsResult.success ? settingsResult.data?.is_premium || false : false;

    return (
        <SettingsClient
            userId={session.user.id}
            fullName={session.user.user_metadata?.full_name || 'Officer'}
            email={session.user.email || ''}
            initialStrictMode={initialStrictMode}
            isPremium={isPremium}
        />
    );
}
