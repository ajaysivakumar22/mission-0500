import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getServerSession } from '@/lib/supabase/server';
import { getTasksForDate } from '@/server/actions/tasks';
import { getServerDate } from '@/server/utils/timezone';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskSkeleton } from '@/components/ui/Skeletons';
import TasksClient from './TasksClient';

export default async function TasksPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    return (
        <MainLayout>
            <div className="space-y-8 animate-slide-in">
                <PageHeader
                    title="Daily Tasks"
                    subtitle="Set your main objective. Execute secondary tasks. Leave nothing on the table."
                />

                <Suspense fallback={<TaskSkeleton />}>
                    <TasksSection userId={session.user.id} />
                </Suspense>
            </div>
        </MainLayout>
    );
}

async function TasksSection({ userId }: { userId: string }) {
    const today = await getServerDate(userId);
    const result = await getTasksForDate(userId, today);
    const tasks = result.success && result.data ? result.data : [];

    return (
        <TasksClient
            userId={userId}
            initialTasks={tasks}
        />
    );
}
