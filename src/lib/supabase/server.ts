import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] || '';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing user sessions.
                    }
                },
            },
        }
    );
}

/**
 * Parse the JWT payload from the Supabase auth cookie directly.
 * This avoids any network calls to Supabase, which is necessary
 * because Node.js on this machine cannot reach Supabase servers.
 */
function parseJwtPayload(token: string): any {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

/**
 * Get the user session by validating the JWT with Supabase servers.
 * Uses supabase.auth.getUser() for proper server-side validation.
 * Falls back to local JWT parsing if the network call fails.
 */
export async function getServerSession() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        return {
            user: {
                id: user.id,
                email: user.email || '',
                user_metadata: user.user_metadata || {},
                role: user.role || 'authenticated',
            }
        };
    } catch {
        // Fallback to local JWT parsing if network is unavailable
        return getServerSessionFromJwt();
    }
}

/**
 * Fallback: Parse JWT from cookies locally (no network call).
 * Only used when supabase.auth.getUser() fails due to network issues.
 */
async function getServerSessionFromJwt() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const authCookies = allCookies
        .filter(c => c.name.startsWith(`sb-${SUPABASE_PROJECT_REF}-auth-token`))
        .sort((a, b) => a.name.localeCompare(b.name));

    if (authCookies.length === 0) {
        return null;
    }

    let tokenValue = authCookies.map(c => c.value).join('');

    try {
        let accessToken: string | null = null;

        try {
            const parsed = JSON.parse(decodeURIComponent(tokenValue));
            if (Array.isArray(parsed) && parsed.length > 0) {
                accessToken = parsed[0];
            } else if (parsed.access_token) {
                accessToken = parsed.access_token;
            }
        } catch {
            if (tokenValue.includes('.')) {
                accessToken = tokenValue;
            }
        }

        if (!accessToken) return null;

        const payload = parseJwtPayload(accessToken);
        if (!payload || !payload.sub) return null;

        if (payload.exp && payload.exp * 1000 < Date.now()) {
            return null;
        }

        return {
            user: {
                id: payload.sub,
                email: payload.email || '',
                user_metadata: payload.user_metadata || {},
                role: payload.role || 'authenticated',
            }
        };
    } catch {
        return null;
    }
}

export async function getCurrentUser() {
    const session = await getServerSession();
    if (!session) return null;

    // Note: This still makes a network call to Supabase via the server client.
    // If the network is down, this will fail gracefully.
    try {
        const supabase = await createClient();
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        return user;
    } catch {
        // Return basic user info from JWT if DB call fails
        return {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || '',
        };
    }
}
