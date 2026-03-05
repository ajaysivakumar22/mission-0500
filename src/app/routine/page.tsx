import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getRoutineForDate, initializeDefaultRoutine } from '@/server/actions/routine';
import { getServerDate } from '@/server/utils/timezone';
import RoutineClient from './RoutineClient';

export default async function RoutinePage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const today = await getServerDate(session.user.id);

    // Initialize default routine if needed
    await initializeDefaultRoutine(session.user.id, today);

    // Load routines
    const result = await getRoutineForDate(session.user.id, today);
    const routines = result.success && result.data ? result.data : [];

    return (
        <RoutineClient
            userId={session.user.id}
            initialRoutines={routines}
        />
    );
}
