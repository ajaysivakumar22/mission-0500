import { supabaseAdmin } from '@/lib/supabase/admin';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
    let usersCount = 0;
    let users: any[] = [];
    let feedbacks: any[] = [];
    let subscriptions: any[] = [];
    let totalSubscriptions = 0;
    let totalRevenue = 0;
    let userGrowthData: any[] = [];
    let revenueData: any[] = [];

    const timeoutFallback = <T,>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> =>
        Promise.race([Promise.resolve(promise), new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);

    // 1. Total users count
    try {
        const { count } = await timeoutFallback(
            supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
            3000,
            { count: 0 } as any
        );
        usersCount = count || 0;
    } catch (e) {
        // Failed to fetch user count — fallback to 0
    }

    // 2. Users list
    try {
        const { data } = await timeoutFallback(
            supabaseAdmin
                .from('users')
                .select('id, email, full_name, created_at, role')
                .order('created_at', { ascending: false })
                .limit(100),
            3000,
            { data: [] } as any
        );
        users = data || [];
    } catch (e) {
        // Failed to fetch users — fallback to empty
    }

    // 3. Feedbacks
    try {
        const { data } = await timeoutFallback(
            supabaseAdmin
                .from('user_feedbacks')
                .select('id, user_id, category, message, status, created_at')
                .order('created_at', { ascending: false }),
            3000,
            { data: [] } as any
        );
        feedbacks = data || [];
    } catch (e) {
        // Failed to fetch feedbacks — fallback to empty
    }

    // 4. Subscriptions (with user email via join)
    try {
        const { data, count } = await timeoutFallback(
            supabaseAdmin
                .from('user_subscriptions')
                .select('id, user_id, tier, status, current_period_end, created_at, users(email)', { count: 'exact' })
                .order('created_at', { ascending: false }),
            3000,
            { data: [], count: 0 } as any
        );

        subscriptions = data || [];
        totalSubscriptions = (data || []).filter((s: any) => s.status === 'active').length;

        // Calculate real revenue from subscriptions
        const tierPrices: Record<string, number> = { pro: 999, team: 4999 };
        totalRevenue = (data || []).reduce((sum: number, s: any) => {
            if (s.status === 'active' || s.status === 'trialing') {
                return sum + (tierPrices[s.tier] || 0);
            }
            return sum;
        }, 0);
    } catch (e) {
        // Subscriptions fetch failed — fallback to empty
    }

    // 5. Build user growth chart data (signups per month from real created_at)
    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts: Record<string, number> = {};
        for (const u of users) {
            if (u.created_at) {
                const d = new Date(u.created_at);
                const key = months[d.getMonth()] + ' ' + d.getFullYear();
                monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
            }
        }
        userGrowthData = Object.entries(monthlyCounts).map(([name, count]) => ({ name, users: count }));
    } catch (e) {
        // Failed to build user growth data — fallback to empty
    }

    // 6. Build revenue chart data (subscriptions per month)
    try {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const tierPrices: Record<string, number> = { pro: 999, team: 4999 };
        const monthlyRevenue: Record<string, number> = {};
        for (const s of subscriptions) {
            if (s.created_at) {
                const d = new Date(s.created_at);
                const key = months[d.getMonth()] + ' ' + d.getFullYear();
                monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (tierPrices[s.tier] || 0);
            }
        }
        revenueData = Object.entries(monthlyRevenue).map(([name, amount]) => ({ name, amount }));
    } catch (e) {
        // Failed to build revenue data — fallback to empty
    }

    return (
        <AdminDashboardClient 
            initialUsers={users} 
            initialFeedbacks={feedbacks} 
            initialSubscriptions={subscriptions}
            totalUsers={usersCount}
            totalRevenue={totalRevenue}
            totalSubscriptions={totalSubscriptions}
            userGrowthData={userGrowthData}
            revenueData={revenueData}
        />
    );
}
