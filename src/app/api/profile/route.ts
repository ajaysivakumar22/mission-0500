import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getServerSession } from '@/lib/supabase/server';
import { sanitizeText } from '@/server/utils/sanitize';
import { rateLimit } from '@/lib/utils/rate-limit';

const PROFILE_RATE_LIMIT = { maxRequests: 10, windowSeconds: 60 };

export async function POST(request: NextRequest) {
    const rateLimited = await rateLimit(request, PROFILE_RATE_LIMIT);
    if (rateLimited) return rateLimited;

    try {
        // Verify the caller is authenticated
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, email, fullName } = await request.json();

        if (!userId || !email || !fullName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Ensure the authenticated user can only create/update their own profile
        if (session.user.id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Create user profile using Admin client (bypasses RLS)
        const { error: profileError } = await supabaseAdmin.from('users').upsert({
            id: userId,
            email,
            full_name: sanitizeText(fullName),
        });

        if (profileError) {
            return NextResponse.json(
                { error: 'Failed to create profile' },
                { status: 500 }
            );
        }

        // Initialize default routine items for today
        const today = new Date().toISOString().split('T')[0];
        const { DEFAULT_ROUTINE_ITEMS } = await import('@/lib/constants/xp-config');

        const routineItems = DEFAULT_ROUTINE_ITEMS.map(item => ({
            user_id: userId,
            routine_date: today,
            item_name: item.name,
            item_order: item.order,
        }));

        await supabaseAdmin.from('daily_routines').upsert(
            routineItems,
            { onConflict: 'user_id, routine_date, item_name' }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
