import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getAllGoals } from '@/server/actions/goals';
import GoalsClient from './GoalsClient';

import { getUserSettings } from '@/server/actions/settings';

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
        <GoalsClient
            userId={session.user.id}
            initialGoals={goals}
            isPremium={isPremium}
        />
    );
}
