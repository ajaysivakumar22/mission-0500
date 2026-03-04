import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
    try {
        const { userId, email, fullName } = await request.json();

        if (!userId || !email || !fullName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create user profile using Admin client (bypasses RLS)
        const { error: profileError } = await supabaseAdmin.from('users').upsert({
            id: userId,
            email,
            full_name: fullName,
        });

        if (profileError) {
            console.error('Profile creation error:', profileError);
            return NextResponse.json(
                { error: profileError.message },
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
        console.error('Profile API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
