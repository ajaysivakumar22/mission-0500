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

    const [statsResult, xpResult] = await Promise.all([
        getDashboardStats(session.user.id, today),
        getTotalXP(session.user.id),
    ]);

    const totalXP = xpResult.success && xpResult.data !== undefined ? xpResult.data : 0;
    const rank = calculateRank(totalXP);

    return (
        <DashboardClient
            stats={statsResult.success ? statsResult.data ?? null : null}
            totalXP={totalXP}
            rank={rank}
        />
    );
}
