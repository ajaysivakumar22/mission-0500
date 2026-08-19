import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getAllGoals } from '@/server/actions/goals';
import { getUserSettings } from '@/server/actions/settings';
import { MainLayout } from '@/components/layout/MainLayout';
import GoalsClient from './GoalsClient';

export default async function GoalsPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const [goalsResult, settingsResult] = await Promise.all([
        getAllGoals(session.user.id),
        getUserSettings(session.user.id)
    ]);

    const goals = goalsResult.success && goalsResult.data ? goalsResult.data : [];
    const isPremium = settingsResult.success ? settingsResult.data?.is_premium || false : false;

    return (
        <MainLayout>
            <GoalsClient
                userId={session.user.id}
                initialGoals={goals}
                isPremium={isPremium}
            />
        </MainLayout>
    );
}
