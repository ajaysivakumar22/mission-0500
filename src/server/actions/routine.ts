'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateRoutineItem } from '@/lib/utils/validators';
import { XP_CONFIG } from '@/lib/utils/xp';
import { awardXP } from '@/server/services/xp-service';
import { getUserSettings } from '@/server/actions/settings';
import type { ApiResponse, DailyRoutine, RoutineCreateInput, RoutineUpdateInput } from '@/types';

export async function getRoutineForDate(
    userId: string,
    date: string
): Promise<ApiResponse<DailyRoutine[]>> {
    try {
        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from('daily_routines')
            .select('*')
            .eq('user_id', userId)
            .eq('routine_date', date)
            .order('item_order', { ascending: true });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch routine' };
    }
}

export async function addRoutineItem(
    userId: string,
    input: RoutineCreateInput
): Promise<ApiResponse<DailyRoutine>> {
    try {
        if (!validateRoutineItem(input.item_name)) {
            return { success: false, error: 'Invalid routine item name' };
        }

        const supabase = supabaseAdmin;

        // Get max order for this date
        const { data: existing } = await supabase
            .from('daily_routines')
            .select('item_order')
            .eq('user_id', userId)
            .eq('routine_date', input.routine_date)
            .order('item_order', { ascending: false })
            .limit(1);

        const nextOrder = (existing?.[0]?.item_order ?? 0) + 1;

        const { data, error } = await supabase
            .from('daily_routines')
            .insert({
                user_id: userId,
                routine_date: input.routine_date,
                item_name: input.item_name,
                item_order: input.item_order ?? nextOrder,
                notes: input.notes,
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/routine');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to add routine item' };
    }
}

export async function updateRoutineItem(
    userId: string,
    itemId: string,
    input: RoutineUpdateInput
): Promise<ApiResponse<DailyRoutine>> {
    try {
        const supabase = supabaseAdmin;

        // Get the current item first
        const { data: currentItem, error: fetchError } = await supabase
            .from('daily_routines')
            .select('*')
            .eq('id', itemId)
            .eq('user_id', userId)
            .single();

        if (fetchError || !currentItem) {
            return { success: false, error: 'Routine item not found' };
        }

        const updateData: Partial<DailyRoutine> = {};

        if (input.item_name !== undefined) {
            if (!validateRoutineItem(input.item_name)) {
                return { success: false, error: 'Invalid routine item name' };
            }
            updateData.item_name = input.item_name;
        }

        if (input.is_completed !== undefined) {
            updateData.is_completed = input.is_completed;
            updateData.completed_at = input.is_completed ? new Date().toISOString() : null;

            // Award XP if completing, or Punish if uncompleting in Strict Mode
            if (input.is_completed && !currentItem.is_completed) {
                await awardXP(userId, XP_CONFIG.ROUTINE_COMPLETION, `Completed routine: ${currentItem.item_name}`, currentItem.routine_date);
            } else if (!input.is_completed && currentItem.is_completed) {
                // Check if they are in Strict Mode
                const settingsResult = await getUserSettings(userId);
                if (settingsResult.success && settingsResult.data?.strict_mode) {
                    await awardXP(
                        userId,
                        XP_CONFIG.PUNISHMENT_MISSED_DAY,
                        `STRICT MODE PENALTY: Failed routine ${currentItem.item_name}`,
                        currentItem.routine_date
                    );
                }
            }
        }

        if (input.notes !== undefined) {
            updateData.notes = input.notes;
        }

        if (input.item_order !== undefined) {
            updateData.item_order = input.item_order;
        }

        const { data, error } = await supabase
            .from('daily_routines')
            .update(updateData)
            .eq('id', itemId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        // Check for full day completion bonus
        if (input.is_completed) {
            await checkAndAwardFullDayBonus(userId, currentItem.routine_date);
        }

        revalidatePath('/routine');
        revalidatePath('/dashboard');
        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to update routine item' };
    }
}

export async function deleteRoutineItem(
    userId: string,
    itemId: string
): Promise<ApiResponse> {
    try {
        const supabase = supabaseAdmin;

        const { error } = await supabase
            .from('daily_routines')
            .delete()
            .eq('id', itemId)
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/routine');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete routine item' };
    }
}

export async function getRoutineCompletionPercentage(
    userId: string,
    date: string
): Promise<ApiResponse<number>> {
    try {
        const supabase = supabaseAdmin;

        const { data, error } = await supabase.rpc(
            'get_routine_completion_percentage',
            { user_id_param: userId, target_date: date }
        );

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data: data || 0 };
    } catch (error) {
        return { success: false, error: 'Failed to calculate completion percentage' };
    }
}



async function checkAndAwardFullDayBonus(
    userId: string,
    date: string
): Promise<void> {
    try {
        const supabase = supabaseAdmin;

        // Get all routines for this date
        const { data: routines } = await supabase
            .from('daily_routines')
            .select('id, is_completed')
            .eq('user_id', userId)
            .eq('routine_date', date);

        if (!routines || routines.length === 0) return;

        const allCompleted = routines.every(r => r.is_completed);

        if (allCompleted) {
            // Check if bonus already awarded
            const { data: existingBonus } = await supabase
                .from('xp_records')
                .select('id')
                .eq('user_id', userId)
                .like('reason', `Full day completion%`)
                .eq('related_date', date)
                .limit(1);

            if (!existingBonus || existingBonus.length === 0) {
                await awardXP(
                    userId,
                    XP_CONFIG.FULL_DAY_BONUS,
                    'Full day completion bonus',
                    date
                );
            }
        }
    } catch (error) {
        console.error('Failed to check/award full day bonus:', error);
    }
}

export async function initializeDefaultRoutine(
    userId: string,
    date: string
): Promise<ApiResponse> {
    try {
        const supabase = supabaseAdmin;
        const { DEFAULT_ROUTINE_ITEMS } = await import('@/lib/constants/xp-config');

        // Check if routine already exists for this date
        const { data: existing } = await supabase
            .from('daily_routines')
            .select('id')
            .eq('user_id', userId)
            .eq('routine_date', date)
            .limit(1);

        if (existing && existing.length > 0) {
            return { success: true }; // Already initialized
        }

        const routineItems = DEFAULT_ROUTINE_ITEMS.map(item => ({
            user_id: userId,
            routine_date: date,
            item_name: item.name,
            item_order: item.order,
        }));

        const { error } = await supabase
            .from('daily_routines')
            .insert(routineItems);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/routine');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to initialize routine' };
    }
}
