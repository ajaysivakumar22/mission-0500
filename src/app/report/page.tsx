import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getReportForDate } from '@/server/actions/reports';
import ReportClient from './ReportClient';

export default async function ReportPage() {
    // logic and redirecting paused for now to focus on UI
    /*
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const today = new Date().toISOString().split('T')[0];
    const result = await getReportForDate(session.user.id, today);
    const report = result.success ? result.data ?? null : null;
    */
    const report = null;

    return (
        <ReportClient
            userId={'mock-user-id'}
            initialReport={report}
        />
    );
}
