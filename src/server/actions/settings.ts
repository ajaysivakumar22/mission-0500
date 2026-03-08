'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyCallerIdentity } from '@/server/utils/auth-guard';
import type { ApiResponse } from '@/types';
import type { ThemeType } from '@/lib/context/ThemeContext';

const VALID_THEMES: ThemeType[] = ['operator', 'scholar', 'athlete', 'protagonist'];

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
                    data: { user_id: userId, strict_mode: false, theme: 'operator', onboarding_completed: false, is_premium: isPremium }
                };
            }
            return { success: false, error: 'Failed to fetch user settings' };
        }

        // Ensure onboarding_completed has a value even if column doesn't exist in DB yet
        const settingsData = settingsResponse.data;
        return {
            success: true,
            data: {
                ...settingsData,
                onboarding_completed: settingsData.onboarding_completed ?? false,
                is_premium: isPremium
            }
        };


    } catch (error) {
        return { success: false, error: 'Failed to fetch user settings' };
    }
}

export async function updateUserSettings(
    userId: string,
    settings: Partial<UserSettings>
): Promise<ApiResponse<UserSettings>> {
    try {
        const verified = await verifyCallerIdentity(userId);
        if (!verified) return { success: false, error: 'Unauthorized' };

        // Validate theme if provided
        if (settings.theme && !VALID_THEMES.includes(settings.theme as ThemeType)) {
            return { success: false, error: 'Invalid theme' };
        }

        // Whitelist allowed fields to prevent injection of arbitrary DB columns
        const safeSettings: Record<string, unknown> = { user_id: userId, updated_at: new Date().toISOString() };
        if (settings.strict_mode !== undefined) safeSettings.strict_mode = settings.strict_mode;
        if (settings.theme !== undefined) safeSettings.theme = settings.theme;
        if (settings.timezone !== undefined) safeSettings.timezone = settings.timezone;
        if (settings.onboarding_completed !== undefined) safeSettings.onboarding_completed = settings.onboarding_completed;

        const { data, error } = await supabaseAdmin
            .from('user_settings')
            .upsert(safeSettings)
            .select()
            .single();

        if (error) {
            return { success: false, error: 'Failed to update settings' };
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: 'Failed to update settings' };
    }
}
