import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getDashboardStats } from '@/server/services/dashboard-service';
import { getTotalXP } from '@/server/services/xp-service';
import { calculateRank } from '@/lib/utils/xp';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const today = new Date().toISOString().split('T')[0];

    // Wrap data fetching with a timeout to prevent hanging when
    // the server cannot reach Supabase (network connectivity issue).
    let stats = null;
    let totalXP = 0;

    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Data fetch timeout')), 5000)
        );

        const dataPromise = Promise.all([
            getDashboardStats(session.user.id, today),
            getTotalXP(session.user.id),
        ]);

        const [statsResult, xpResult] = await Promise.race([
            dataPromise,
            timeoutPromise.then(() => { throw new Error('timeout'); }),
        ]) as any;

        stats = statsResult?.success && statsResult?.data ? statsResult.data : null;
        totalXP = xpResult?.success && xpResult?.data !== undefined ? xpResult.data : 0;
    } catch (error) {
        console.warn('[DASHBOARD] Data fetch failed or timed out, showing empty dashboard:', error);
    }

    const rank = calculateRank(totalXP);

    return (
        <DashboardClient
            stats={stats}
            totalXP={totalXP}
            rank={rank}
        />
    );
}
