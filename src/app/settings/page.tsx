import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    return (
        <SettingsClient
            userId={session.user.id}
            fullName={session.user.user_metadata?.full_name || 'Officer'}
            email={session.user.email || ''}
        />
    );
}
