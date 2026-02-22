import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getTasksForDate } from '@/server/actions/tasks';
import TasksClient from './TasksClient';

export default async function TasksPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const today = new Date().toISOString().split('T')[0];
    const result = await getTasksForDate(session.user.id, today);
    const tasks = result.success && result.data ? result.data : [];

    return (
        <TasksClient
            userId={session.user.id}
            initialTasks={tasks}
        />
    );
}
