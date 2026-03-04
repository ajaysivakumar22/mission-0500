import { supabaseAdmin } from '@/lib/supabase/admin';
import { MEDALS } from '@/lib/constants/medals';
import type { DashboardStats } from '@/types';

export async function checkAndAwardMedals(userId: string, stats: DashboardStats) {
    try {
        // Fetch currently earned medals
        const { data: earnedMedals, error: fetchError } = await supabaseAdmin
            .from('user_medals')
            .select('medal_id')
            .eq('user_id', userId);

        if (fetchError) {
            console.error('Failed to fetch earned medals', fetchError);
            return;
        }

        const earnedMedalIds = new Set(earnedMedals?.map(m => m.medal_id) || []);

        // Medals to newly award
        const newAwards: { user_id: string, medal_id: string }[] = [];

        // Fetch additional stats if needed (like total tasks completed)
        const { count: tasksCompleted } = await supabaseAdmin
            .from('daily_tasks')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_completed', true);

        const { count: routinesCompleted } = await supabaseAdmin
            .from('daily_routines')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_completed', true);


        for (const medal of MEDALS) {
            if (earnedMedalIds.has(medal.id)) continue; // Already have it

            let qualifies = false;

            switch (medal.requirement_type) {
                case 'streak':
                    qualifies = stats.current_streak >= medal.requirement_value;
                    break;
                case 'xp':
                    qualifies = stats.total_xp >= medal.requirement_value;
                    break;
                case 'tasks_completed':
                    qualifies = (tasksCompleted || 0) >= medal.requirement_value;
                    break;
                case 'routines_completed':
                    qualifies = (routinesCompleted || 0) >= medal.requirement_value;
                    break;
            }

            if (qualifies) {
                newAwards.push({ user_id: userId, medal_id: medal.id });
            }
        }

        if (newAwards.length > 0) {
            const { error: insertError } = await supabaseAdmin
                .from('user_medals')
                .insert(newAwards);

            if (insertError) {
                console.error('Failed to award new medals', insertError);
            } else {
                console.log(`Successfully awarded ${newAwards.length} new medals to user ${userId}`);
            }
        }

    } catch (error) {
        console.error('Error in checkAndAwardMedals:', error);
    }
}

export async function getEarnedMedals(userId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('user_medals')
            .select('medal_id, earned_at')
            .eq('user_id', userId)
            .order('earned_at', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch earned medals' };
    }
}
