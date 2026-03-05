import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getDashboardStats, getHeatmapData } from '@/server/services/dashboard-service';
import { getTotalXP } from '@/server/services/xp-service';
import { checkAndAwardMedals } from '@/server/services/medals-service';
import { calculateRank } from '@/lib/utils/xp';
import { getUserSettings } from '@/server/actions/settings';
import { getServerDate } from '@/server/utils/timezone';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const { data: userSettings } = await getUserSettings(session.user.id);
    if (userSettings && !userSettings.onboarding_completed) {
        redirect('/onboarding');
    }

    const today = await getServerDate(session.user.id);

    // Wrap data fetching with a timeout to prevent hanging when
    // the server cannot reach Supabase (network connectivity issue).
    let stats = null;
    let totalXP = 0;
    let heatmapData = null;

    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Data fetch timeout')), 5000)
        );

        const dataPromise = Promise.all([
            getDashboardStats(session.user.id, today),
            getTotalXP(session.user.id),
            getHeatmapData(session.user.id, 30),
        ]);

        const [statsResult, xpResult, heatmapResult] = await Promise.race([
            dataPromise,
            timeoutPromise.then(() => { throw new Error('timeout'); }),
        ]) as any;

        stats = statsResult?.success && statsResult?.data ? statsResult.data : null;
        totalXP = xpResult?.success && xpResult?.data !== undefined ? xpResult.data : 0;
        heatmapData = heatmapResult?.success && heatmapResult?.data ? heatmapResult.data : [];

        // Check and award any new medals in the background
        if (stats) {
            checkAndAwardMedals(session.user.id, stats).catch(console.error);
        }
    } catch (error) {
        console.warn('[DASHBOARD] Data fetch failed or timed out, showing empty dashboard:', error);
    }

    const rank = calculateRank(totalXP);

    return (
        <DashboardClient
            userId={session.user.id}
            stats={stats}
            totalXP={totalXP}
            rank={rank}
            heatmapData={heatmapData}
        />
    );
}
