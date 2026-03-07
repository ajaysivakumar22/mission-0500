'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateGoalTitle } from '@/lib/utils/validators';
import { verifyCallerIdentity } from '@/server/utils/auth-guard';
import { sanitizeText, sanitizeOptional } from '@/server/utils/sanitize';
import type { ApiResponse, Goal, GoalCreateInput, GoalUpdateInput, GoalLog, GoalLogCreateInput, GoalCategory } from '@/types';

const VALID_CATEGORIES: GoalCategory[] = ['short_term', 'mid_term', 'long_term'];

export async function getAllGoals(userId: string): Promise<ApiResponse<Goal[]>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .eq('is_archived', false)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch goals' };
    }
}

export async function getGoalsByCategory(
    userId: string,
    category: string
): Promise<ApiResponse<Goal[]>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        if (!VALID_CATEGORIES.includes(category as GoalCategory)) {
            return { success: false, error: 'Invalid category' };
        }

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .eq('category', category)
            .eq('is_archived', false)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch goals' };
    }
}

export async function getActiveGoalsCount(userId: string): Promise<ApiResponse<number>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { count, error } = await supabase
            .from('goals')
            .select('id', { count: 'exact' })
            .eq('user_id', userId)
            .eq('is_archived', false);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: 'Failed to fetch goals count' };
    }
}

export async function createGoal(
    userId: string,
    input: GoalCreateInput
): Promise<ApiResponse<Goal>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        if (!validateGoalTitle(input.title)) {
            return { success: false, error: 'Invalid goal title' };
        }

        if (!VALID_CATEGORIES.includes(input.category)) {
            return { success: false, error: 'Invalid category. Must be short_term, mid_term, or long_term' };
        }

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('goals')
            .insert({
                user_id: userId,
                title: sanitizeText(input.title),
                description: sanitizeOptional(input.description),
                category: input.category,
                target_date: input.target_date,
                progress_percentage: input.progress_percentage || 0,
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/goals');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to create goal' };
    }
}

export async function updateGoal(
    userId: string,
    goalId: string,
    input: GoalUpdateInput
): Promise<ApiResponse<Goal>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        if (input.title && !validateGoalTitle(input.title)) {
            return { success: false, error: 'Invalid goal title' };
        }

        if (input.progress_percentage !== undefined) {
            if (input.progress_percentage < 0 || input.progress_percentage > 100) {
                return { success: false, error: 'Progress must be between 0 and 100' };
            }
        }

        const updateData: Partial<Goal> = {};

        if (input.title !== undefined) updateData.title = sanitizeText(input.title);
        if (input.description !== undefined) updateData.description = sanitizeOptional(input.description);
        if (input.progress_percentage !== undefined) updateData.progress_percentage = input.progress_percentage;
        if (input.target_date !== undefined) updateData.target_date = input.target_date;
        if (input.is_archived !== undefined) updateData.is_archived = input.is_archived;

        const { data, error } = await supabase
            .from('goals')
            .update(updateData)
            .eq('id', goalId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/goals');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to update goal' };
    }
}

export async function deleteGoal(
    userId: string,
    goalId: string
): Promise<ApiResponse> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        // First delete all goal logs
        await supabase
            .from('goal_logs')
            .delete()
            .eq('goal_id', goalId)
            .eq('user_id', userId);

        // Then delete the goal
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalId)
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/goals');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete goal' };
    }
}

export async function archiveGoal(
    userId: string,
    goalId: string
): Promise<ApiResponse> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { error } = await supabase
            .from('goals')
            .update({ is_archived: true })
            .eq('id', goalId)
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/goals');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to archive goal' };
    }
}

// Goal Logs

export async function getGoalLogs(userId: string, goalId: string): Promise<ApiResponse<GoalLog[]>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('goal_logs')
            .select('*')
            .eq('goal_id', goalId)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch goal logs' };
    }
}

export async function addGoalLog(
    userId: string,
    input: GoalLogCreateInput
): Promise<ApiResponse<GoalLog>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        if (!input.entry_text || input.entry_text.trim().length === 0) {
            return { success: false, error: 'Goal log entry is required' };
        }

        const supabase = supabaseAdmin;

        // Verify the goal belongs to the user
        const { data: goal, error: goalError } = await supabase
            .from('goals')
            .select('id')
            .eq('id', input.goal_id)
            .eq('user_id', userId)
            .single();

        if (goalError || !goal) {
            return { success: false, error: 'Goal not found' };
        }

        // Update goal progress if increment provided
        if (input.progress_increment && input.progress_increment > 0) {
            // Validate increment is within reasonable bounds
            if (input.progress_increment > 100) {
                return { success: false, error: 'Progress increment cannot exceed 100' };
            }
            const { data: currentGoal } = await supabase
                .from('goals')
                .select('progress_percentage')
                .eq('id', input.goal_id)
                .single();

            if (currentGoal) {
                const newProgress = Math.min(
                    100,
                    (currentGoal.progress_percentage || 0) + input.progress_increment
                );

                await supabase
                    .from('goals')
                    .update({ progress_percentage: newProgress })
                    .eq('id', input.goal_id);
            }
        }

        const { data, error } = await supabase
            .from('goal_logs')
            .insert({
                user_id: userId,
                goal_id: input.goal_id,
                entry_text: sanitizeText(input.entry_text.trim()),
                progress_increment: input.progress_increment || 0,
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/goals');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to add goal log' };
    }
}

export async function deleteGoalLog(
    userId: string,
    logId: string
): Promise<ApiResponse> {
    try {
        const supabase = supabaseAdmin;

        const { error } = await supabase
            .from('goal_logs')
            .delete()
            .eq('id', logId)
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/goals');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete goal log' };
    }
}
