'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculateRank, type Rank } from '@/lib/utils/xp';
import type { ApiResponse, XPRecord } from '@/types';

export async function getTotalXP(userId: string): Promise<ApiResponse<number>> {
    try {
        const supabase = supabaseAdmin;

        const { data, error } = await supabase.rpc('get_user_total_xp', {
            user_id_param: userId,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || 0 };
    } catch (error) {
        return { success: false, error: 'Failed to fetch total XP' };
    }
}

export async function getXPRecords(userId: string, limit = 10): Promise<ApiResponse<XPRecord[]>> {
    try {
        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('xp_records')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch XP records' };
    }
}

export async function getUserRank(userId: string): Promise<ApiResponse<Rank>> {
    try {
        const xpResponse = await getTotalXP(userId);

        if (!xpResponse.success || xpResponse.data === undefined) {
            return { success: false, error: 'Failed to fetch user XP' };
        }

        const rank = calculateRank(xpResponse.data);

        return { success: true, data: rank };
    } catch (error) {
        return { success: false, error: 'Failed to calculate rank' };
    }
}

export async function getXPForDate(
    userId: string,
    date: string
): Promise<ApiResponse<number>> {
    try {
        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('xp_records')
            .select('amount')
            .eq('user_id', userId)
            .eq('related_date', date);

        if (error) {
            return { success: false, error: error.message };
        }

        const total = (data || []).reduce((sum, record) => sum + record.amount, 0);

        return { success: true, data: total };
    } catch (error) {
        return { success: false, error: 'Failed to fetch daily XP' };
    }
}

export async function getXPTrendForWeek(
    userId: string,
    endDate: string
): Promise<ApiResponse<Record<string, number>>> {
    try {
        const supabase = supabaseAdmin;

        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);

        const { data, error } = await supabase
            .from('xp_records')
            .select('amount, created_at')
            .eq('user_id', userId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', new Date(endDate + 'T23:59:59').toISOString());

        if (error) {
            return { success: false, error: error.message };
        }

        // Group by date
        const trend: Record<string, number> = {};
        (data || []).forEach(record => {
            const date = record.created_at.split('T')[0];
            trend[date] = (trend[date] || 0) + record.amount;
        });

        return { success: true, data: trend };
    } catch (error) {
        return { success: false, error: 'Failed to fetch XP trend' };
    }
}

export async function awardXP(
    userId: string,
    amount: number,
    reason: string,
    relatedDate?: string
): Promise<void> {
    // Security: Validate XP amount is within allowed range
    if (amount < -100 || amount > 100) {
        console.error(`Rejected XP award: amount ${amount} out of range (-100 to 100)`);
        return;
    }

    try {
        const supabase = supabaseAdmin;

        await supabase.from('xp_records').insert({
            user_id: userId,
            amount,
            reason,
            related_date: relatedDate,
        });
    } catch (error) {
        console.error('Failed to award XP:', error);
    }
}
