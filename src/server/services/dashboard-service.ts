'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { calculateRank } from '@/lib/utils/xp';
import type { ApiResponse, DashboardStats } from '@/types';

export async function getDashboardStats(
    userId: string,
    date: string
): Promise<ApiResponse<DashboardStats>> {
    try {
        const supabase = supabaseAdmin;

        // Get routine completion percentage
        const routinePercentageResult = await supabase.rpc(
            'get_routine_completion_percentage',
            { user_id_param: userId, target_date: date }
        );

        // Get task completion percentage
        const taskPercentageResult = await supabase.rpc(
            'get_task_completion_percentage',
            { user_id_param: userId, target_date: date }
        );

        // Get active goals count
        const { count: activeGoalsCount } = await supabase
            .from('goals')
            .select('id', { count: 'exact' })
            .eq('user_id', userId)
            .eq('is_archived', false);

        // Get total XP
        const totalXPResult = await supabase.rpc('get_user_total_xp', {
            user_id_param: userId,
        });

        // Get current streak
        const { data: streakData } = await supabase
            .from('streaks')
            .select('current_streak')
            .eq('user_id', userId)
            .single();

        const totalXP = totalXPResult.data || 0;
        const currentRank = calculateRank(totalXP);

        return {
            success: true,
            data: {
                date,
                routine_completion_percentage: routinePercentageResult.data || 0,
                task_completion_percentage: taskPercentageResult.data || 0,
                active_goals_count: activeGoalsCount || 0,
                current_streak: streakData?.current_streak || 0,
                total_xp: totalXP,
                current_rank: currentRank,
            },
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch dashboard stats' };
    }
}

export async function updateStreakForDate(
    userId: string,
    date: string
): Promise<ApiResponse> {
    try {
        const supabase = supabaseAdmin;

        // Check if all routines are completed for this date
        const { data: routines } = await supabase
            .from('daily_routines')
            .select('is_completed')
            .eq('user_id', userId)
            .eq('routine_date', date);

        if (!routines || routines.length === 0) {
            return { success: true }; // No routines, no streak update
        }

        const allCompleted = routines.every(r => r.is_completed);

        if (!allCompleted) {
            return { success: true }; // Not all completed, no streak update
        }

        // Get current streak data
        const { data: streakData } = await supabase
            .from('streaks')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (!streakData) {
            return { success: true };
        }

        const currentDate = new Date(date);
        const lastCompletionDate = streakData.last_completion_date
            ? new Date(streakData.last_completion_date)
            : null;

        let newStreak = streakData.current_streak || 0;

        if (lastCompletionDate) {
            const daysDiff = Math.floor(
                (currentDate.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysDiff === 1) {
                newStreak += 1;
            } else if (daysDiff > 1) {
                newStreak = 1;
            }
        } else {
            newStreak = 1;
        }

        const longestStreak = Math.max(streakData.longest_streak || 0, newStreak);

        const { error } = await supabase
            .from('streaks')
            .update({
                current_streak: newStreak,
                longest_streak: longestStreak,
                last_completion_date: date,
            })
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update streak' };
    }
}

export async function getHeatmapData(
    userId: string,
    days: number = 30
): Promise<ApiResponse<{ date: string; value: number }[]>> {
    try {
        const supabase = supabaseAdmin;
        
        // Use a simple date offset approach
        // Create an array of the last `days` dates
        const historyData: { date: string; value: number }[] = [];
        
        const end = new Date();
        const start = new Date(end);
        start.setDate(end.getDate() - days + 1);
        
        const startDateStr = start.toISOString().split('T')[0];
        
        // Fetch all routines within the range
        const { data: routines } = await supabase
            .from('daily_routines')
            .select('routine_date, is_completed')
            .eq('user_id', userId)
            .gte('routine_date', startDateStr);

        // Fetch all tasks within the range
        const { data: tasks } = await supabase
            .from('daily_tasks')
            .select('task_date, is_completed')
            .eq('user_id', userId)
            .gte('task_date', startDateStr);
            
        // Process data day by day
        for (let i = 0; i < days; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            
            const dayRoutines = routines?.filter(r => r.routine_date === dateStr) || [];
            const dayTasks = tasks?.filter(t => t.task_date === dateStr) || [];
            
            let totalItems = dayRoutines.length + dayTasks.length;
            let completedItems = dayRoutines.filter(r => r.is_completed).length + 
                                 dayTasks.filter(t => t.is_completed).length;
                                 
            // Calculate a score from 0 to 100
            let score = 0;
            if (totalItems > 0) {
                score = Math.round((completedItems / totalItems) * 100);
            }
            
            historyData.push({ date: dateStr, value: score });
        }

        return { success: true, data: historyData };
    } catch (error) {
        return { success: false, error: 'Failed to fetch heatmap data' };
    }
}
