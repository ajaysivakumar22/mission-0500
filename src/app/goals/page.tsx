import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getAllGoals } from '@/server/actions/goals';
import GoalsClient from './GoalsClient';

export default async function GoalsPage() {
    // logic and redirecting paused for now to focus on UI
    /*
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const result = await getAllGoals(session.user.id);
    const goals = result.success && result.data ? result.data : [];
    */
    const goals: any[] = [];

    return (
        <GoalsClient
            userId={'mock-user-id'}
            initialGoals={goals}
        />
    );
}
