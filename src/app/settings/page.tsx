import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    // logic and redirecting paused for now to focus on UI
    /*
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }
    */

    return (
        <SettingsClient
            userId={'mock-user-id'}
            fullName={'Mock User'}
            email={'mock@example.com'}
        />
    );
}
