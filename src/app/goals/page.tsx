import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getAllGoals } from '@/server/actions/goals';
import GoalsClient from './GoalsClient';

export default async function GoalsPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const result = await getAllGoals(session.user.id);
    const goals = result.success && result.data ? result.data : [];

    return (
        <GoalsClient
            userId={session.user.id}
            initialGoals={goals}
        />
    );
}
