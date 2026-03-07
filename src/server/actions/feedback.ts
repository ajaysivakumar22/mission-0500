'use server';

import { getServerSession } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { sanitizeText } from '@/server/utils/sanitize';

export async function submitFeedback(data: { category: string; message: string }) {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return { success: false, error: 'Unauthorized' };
        }

        const { error } = await supabaseAdmin
            .from('user_feedbacks')
            .insert({
                user_id: session.user.id,
                category: sanitizeText(data.category),
                message: sanitizeText(data.message)
            });

        if (error) {
            return { success: false, error: 'Failed to submit feedback' };
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
