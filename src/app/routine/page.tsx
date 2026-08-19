import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getServerSession } from '@/lib/supabase/server';
import { getRoutineForDate, initializeDefaultRoutine } from '@/server/actions/routine';
import { getServerDate } from '@/server/utils/timezone';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { RoutineSkeleton } from '@/components/ui/Skeletons';
import RoutineClient from './RoutineClient';

export default async function RoutinePage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    return (
        <MainLayout>
            <div className="space-y-8 animate-slide-in">
                <PageHeader
                    title="Daily Routine"
                    subtitle="Execute your non-negotiable daily actions. Consistency compounds."
                    category="DAILY PROTOCOL"
                    showOperationalDate
                />

                <Suspense fallback={<RoutineSkeleton />}>
                    <RoutineSection userId={session.user.id} />
                </Suspense>
            </div>
        </MainLayout>
    );
}

async function RoutineSection({ userId }: { userId: string }) {
    const today = await getServerDate(userId);
    await initializeDefaultRoutine(userId, today);
    const result = await getRoutineForDate(userId, today);
    const routines = result.success && result.data ? result.data : [];

    return (
        <RoutineClient
            userId={userId}
            initialRoutines={routines}
        />
    );
}
