'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ApiResponse } from '@/types';

export interface UserSettings {
    user_id: string;
    strict_mode?: boolean;
    theme?: string;
    timezone?: string;
    onboarding_completed?: boolean;
    is_premium?: boolean;
}

export async function getUserSettings(userId: string): Promise<ApiResponse<UserSettings>> {
    try {
        const [settingsResponse, subResponse] = await Promise.all([
            supabaseAdmin.from('user_settings').select('*').eq('user_id', userId).single(),
            supabaseAdmin.from('user_subscriptions')
                .select('status, current_period_end')
                .eq('user_id', userId)
                .in('status', ['active', 'trialing'])
                .maybeSingle()
        ]);

        let isPremium = false;
        if (subResponse.data && !subResponse.error) {
            const periodEnd = new Date(subResponse.data.current_period_end).getTime();
            if (periodEnd > Date.now()) {
                isPremium = true;
            }
        }

        if (settingsResponse.error) {
            // If settings don't exist yet, or the table is missing entirely from the DB cache, return defaults
            if (settingsResponse.error.code === 'PGRST116' || settingsResponse.error.code === 'PGRST205') {
                return {
                    success: true,
                    data: { user_id: userId, strict_mode: false, theme: 'operator', is_premium: isPremium }
                };
            }
            return { success: false, error: settingsResponse.error.message };
        }

        return { success: true, data: { ...settingsResponse.data, is_premium: isPremium } };


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
