'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ApiResponse } from '@/types';

export interface UserSettings {
    user_id: string;
    strict_mode: boolean;
    theme: string;
}

export async function getUserSettings(userId: string): Promise<ApiResponse<UserSettings>> {
    try {
        const { data, error } = await supabaseAdmin
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // If settings don't exist yet, or the table is missing entirely from the DB cache, return defaults
            if (error.code === 'PGRST116' || error.code === 'PGRST205') {
                return {
                    success: true,
                    data: { user_id: userId, strict_mode: false, theme: 'dark' }
                };
            }
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to fetch user settings' };
    }
}

export async function updateUserSettings(
    userId: string,
    settings: Partial<UserSettings>
): Promise<ApiResponse<UserSettings>> {
    try {
        // Upsert the settings
        const { data, error } = await supabaseAdmin
            .from('user_settings')
            .upsert({ user_id: userId, ...settings, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to update settings' };
    }
}
