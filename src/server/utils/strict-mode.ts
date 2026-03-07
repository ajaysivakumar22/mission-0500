import { supabaseAdmin } from '@/lib/supabase/admin';
import { getUserSettings } from '@/server/actions/settings';
import { XP_CONFIG } from '@/lib/utils/xp';
import { awardXP } from '@/server/services/xp-service';

/**
 * Apply strict mode penalty when a user uncompletes a routine item or task.
 * Deduplicates by checking if a penalty was already awarded for the same item on the same date.
 */
export async function applyStrictModePenalty(
    userId: string,
    itemType: 'routine' | 'task',
    itemName: string,
    relatedDate: string
): Promise<void> {
    const settingsResult = await getUserSettings(userId);
    if (!settingsResult.success || !settingsResult.data?.strict_mode) return;

    const penaltyReason = `STRICT MODE PENALTY: Failed ${itemType} ${itemName}`;
    const { data: existing } = await supabaseAdmin
        .from('xp_records')
        .select('id')
        .eq('user_id', userId)
        .eq('reason', penaltyReason)
        .eq('related_date', relatedDate)
        .limit(1);

    if (!existing || existing.length === 0) {
        await awardXP(userId, XP_CONFIG.PUNISHMENT_MISSED_DAY, penaltyReason, relatedDate);
    }
}
