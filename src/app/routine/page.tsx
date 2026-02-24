import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getRoutineForDate, initializeDefaultRoutine } from '@/server/actions/routine';
import RoutineClient from './RoutineClient';

export default async function RoutinePage() {
    // logic and redirecting paused for now to focus on UI
    /*
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const today = new Date().toISOString().split('T')[0];

    // Initialize default routine if needed
    await initializeDefaultRoutine(session.user.id, today);

    // Load routines
    const result = await getRoutineForDate(session.user.id, today);
    const routines = result.success && result.data ? result.data : [];
    */
    const routines: any[] = [];

    return (
        <RoutineClient
            userId={'mock-user-id'}
            initialRoutines={routines}
        />
    );
}
