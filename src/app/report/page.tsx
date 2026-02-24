import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getReportForDate } from '@/server/actions/reports';
import ReportClient from './ReportClient';

export default async function ReportPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const today = new Date().toISOString().split('T')[0];
    const result = await getReportForDate(session.user.id, today);
    const report = result.success ? result.data ?? null : null;

    return (
        <ReportClient
            userId={session.user.id}
            initialReport={report}
        />
    );
}
