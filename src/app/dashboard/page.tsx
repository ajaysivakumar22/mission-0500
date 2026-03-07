import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getDashboardStats, getHeatmapData } from '@/server/services/dashboard-service';
import { getTotalXP } from '@/server/services/xp-service';
import { checkAndAwardMedals } from '@/server/services/medals-service';
import { calculateRank } from '@/lib/utils/xp';
import { getUserSettings } from '@/server/actions/settings';
import { getServerDate } from '@/server/utils/timezone';
import { supabaseAdmin } from '@/lib/supabase/admin';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const timeoutFallback = <T,>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> =>
        Promise.race([Promise.resolve(promise), new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);

    // Check if admin is trying to access user dashboard
    try {
        const { data: profile } = await timeoutFallback(
            supabaseAdmin.from('users').select('role').eq('id', session.user.id).single(),
            3000,
            { data: null } as any
        );
        if (profile?.role === 'admin') {
            redirect('/admin');
        }
    } catch { /* continue as regular user */ }

    let userSettings: any = null;
    try {
        const result = await timeoutFallback(getUserSettings(session.user.id), 3000, { data: null } as any);
        userSettings = result?.data;
    } catch { /* continue without settings */ }
    
    // Only redirect to onboarding if the column exists and is explicitly false
    if (userSettings && userSettings.onboarding_completed === false) {
        try {
            const { count } = await timeoutFallback(
                supabaseAdmin.from('daily_routines').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id).limit(1),
                3000,
                { count: 1 } as any
            );
            if (!count || count === 0) {
                redirect('/onboarding');
            }
        } catch { /* skip onboarding check */ }
    }

    let today: string;
    try {
        today = await timeoutFallback(getServerDate(session.user.id), 3000, new Date().toISOString().slice(0, 10));
    } catch {
        today = new Date().toISOString().slice(0, 10);
    }

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

    // Check if user already set today's objective (server-side, not localStorage)
    let hasTodayObjective = false;
    try {
        const { data: objectives } = await timeoutFallback(
            supabaseAdmin
                .from('daily_tasks')
                .select('id')
                .eq('user_id', session.user.id)
                .eq('task_date', today)
                .like('title', 'MAIN OBJECTIVE:%')
                .limit(1),
            3000,
            { data: null } as any
        );
        hasTodayObjective = !!(objectives && objectives.length > 0);
    } catch { /* fallback to not showing modal */ }

    return (
        <DashboardClient
            userId={session.user.id}
            stats={stats}
            totalXP={totalXP}
            rank={rank}
            heatmapData={heatmapData}
            hasTodayObjective={hasTodayObjective}
        />
    );
}
