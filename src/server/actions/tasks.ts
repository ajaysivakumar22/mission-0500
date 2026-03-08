'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateTaskTitle } from '@/lib/utils/validators';
import { XP_CONFIG } from '@/lib/utils/xp';
import { awardXP } from '@/server/services/xp-service';
import { verifyCallerIdentity } from '@/server/utils/auth-guard';
import { sanitizeText, sanitizeOptional } from '@/server/utils/sanitize';
import { applyStrictModePenalty } from '@/server/utils/strict-mode';
import type { ApiResponse, DailyTask, TaskCreateInput, TaskUpdateInput, TaskPriority } from '@/types';

const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export async function getTasksForDate(
    userId: string,
    date: string
): Promise<ApiResponse<DailyTask[]>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('daily_tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('task_date', date)
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, error: 'Failed to fetch tasks' };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch tasks' };
    }
}

export async function getAllTasks(userId: string): Promise<ApiResponse<DailyTask[]>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('daily_tasks')
            .select('*')
            .eq('user_id', userId)
            .order('task_date', { ascending: false });

        if (error) {
            return { success: false, error: 'Failed to fetch tasks' };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch tasks' };
    }
}

export async function addTask(
    userId: string,
    input: TaskCreateInput
): Promise<ApiResponse<DailyTask>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        if (!validateTaskTitle(input.title)) {
            return { success: false, error: 'Invalid task title' };
        }

        const priority = input.priority || 'medium';
        if (!VALID_PRIORITIES.includes(priority)) {
            return { success: false, error: 'Invalid priority. Must be low, medium, or high' };
        }

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('daily_tasks')
            .insert({
                user_id: userId,
                task_date: input.task_date,
                title: sanitizeText(input.title),
                description: sanitizeOptional(input.description),
                priority,
                goal_id: input.goal_id,
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: 'Failed to create task' };
        }

        revalidatePath('/tasks');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to create task' };
    }
}

export async function updateTask(
    userId: string,
    taskId: string,
    input: TaskUpdateInput
): Promise<ApiResponse<DailyTask>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        // Get the current task
        const { data: currentTask, error: fetchError } = await supabase
            .from('daily_tasks')
            .select('*')
            .eq('id', taskId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !currentTask) {
            return { success: false, error: 'Task not found' };
        }

        const updateData: Partial<DailyTask> = {};

        if (input.title !== undefined) {
            if (!validateTaskTitle(input.title)) {
                return { success: false, error: 'Invalid task title' };
            }
            updateData.title = sanitizeText(input.title);
        }

        if (input.description !== undefined) {
            updateData.description = sanitizeOptional(input.description);
        }

        if (input.priority !== undefined) {
            if (!VALID_PRIORITIES.includes(input.priority)) {
                return { success: false, error: 'Invalid priority. Must be low, medium, or high' };
            }
            updateData.priority = input.priority;
        }

        if (input.goal_id !== undefined) {
            updateData.goal_id = input.goal_id;
        }

        if (input.is_completed !== undefined) {
            updateData.is_completed = input.is_completed;
            updateData.completed_at = input.is_completed ? new Date().toISOString() : null;

            // Award XP if completing, or apply strict mode penalty if uncompleting
            if (input.is_completed && !currentTask.is_completed) {
                await awardXP(userId, XP_CONFIG.TASK_COMPLETION, `Completed task: ${currentTask.title}`, currentTask.task_date);
            } else if (!input.is_completed && currentTask.is_completed) {
                await applyStrictModePenalty(userId, 'task', currentTask.title, currentTask.task_date);
            }
        }

        const { data, error } = await supabase
            .from('daily_tasks')
            .update(updateData)
            .eq('id', taskId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            return { success: false, error: 'Failed to update task' };
        }

        revalidatePath('/tasks');
        revalidatePath('/dashboard');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to update task' };
    }
}

export async function deleteTask(
    userId: string,
    taskId: string
): Promise<ApiResponse> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { error } = await supabase
            .from('daily_tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: 'Failed to delete task' };
        }

        revalidatePath('/tasks');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete task' };
    }
}

export async function getTaskCompletionPercentage(
    userId: string,
    date: string
): Promise<ApiResponse<number>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { data, error } = await supabase.rpc(
            'get_task_completion_percentage',
            { user_id_param: userId, target_date: date }
        );

        if (error) {
            return { success: false, error: 'Failed to calculate completion percentage' };
        }

        return { success: true, data: data || 0 };
    } catch (error) {
        return { success: false, error: 'Failed to calculate completion percentage' };
    }
}

export async function getCompletedTasksCount(userId: string): Promise<ApiResponse<number>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        const supabase = supabaseAdmin;

        const { count, error } = await supabase
            .from('daily_tasks')
            .select('id', { count: 'exact' })
            .eq('user_id', userId)
            .eq('is_completed', true);

        if (error) {
            return { success: false, error: 'Failed to fetch completed tasks count' };
        }

        return { success: true, data: count || 0 };
    } catch (error) {
        return { success: false, error: 'Failed to fetch completed tasks count' };
    }
}

