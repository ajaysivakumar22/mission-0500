import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getReportForDate, getAllReports } from '@/server/actions/reports';
import { getUserSettings } from '@/server/actions/settings';
import { getServerDate } from '@/server/utils/timezone';
import ReportClient from './ReportClient';

export default async function ReportPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const today = await getServerDate(session.user.id);

    // Fetch today's report, historical reports, and user settings concurrently
    const [todayResult, historyResult, settingsResult] = await Promise.all([
        getReportForDate(session.user.id, today),
        getAllReports(session.user.id),
        getUserSettings(session.user.id)
    ]);

    const report = todayResult.success ? todayResult.data ?? null : null;
    const allReports = historyResult.success ? historyResult.data ?? [] : [];
    const isPremium = settingsResult.success ? settingsResult.data?.is_premium ?? false : false;

    return (
        <ReportClient
            userId={session.user.id}
            initialReport={report}
            allReports={allReports}
            isPremium={isPremium}
        />
    );
}
