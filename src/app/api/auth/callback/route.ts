import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/utils/rate-limit';

const AUTH_RATE_LIMIT = { maxRequests: 15, windowSeconds: 60 };

export async function GET(request: NextRequest) {
    const rateLimited = await rateLimit(request, AUTH_RATE_LIMIT);
    if (rateLimited) return rateLimited;

    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const nextParam = searchParams.get('next') ?? '/';

    // Validate redirect target — must be a relative path, not an external URL
    const next = (nextParam.startsWith('/') && !nextParam.startsWith('//')) ? nextParam : '/';

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Cookie setting may fail in some edge cases
                        }
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // If no code or exchange failed, redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
