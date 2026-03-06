'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitFeedback(data: { category: string; message: string }) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: 'Unauthorized' };
        }

        const { error } = await supabase
            .from('user_feedbacks')
            .insert({
                user_id: user.id,
                category: data.category,
                message: data.message
            });

        if (error) {
            console.error('Feedback insertion error:', error);
            return { success: false, error: 'Failed to submit feedback' };
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
