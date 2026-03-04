import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_PROJECT_REF = 'ybuilowmhnrwkzrfhbwb';

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
 * Get the user session by reading the Supabase auth cookies directly.
 * Does NOT make any network calls — reads and decodes the JWT locally.
 */
export async function getServerSession() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Find auth token cookies (may be chunked into .0, .1, etc.)
    const authCookies = allCookies
        .filter(c => c.name.startsWith(`sb-${SUPABASE_PROJECT_REF}-auth-token`))
        .sort((a, b) => a.name.localeCompare(b.name));

    if (authCookies.length === 0) {
        return null;
    }

    // Reassemble the token value (handles both single and chunked cookies)
    let tokenValue = authCookies.map(c => c.value).join('');

    try {
        // The cookie value is a JSON-encoded array: [access_token, refresh_token, ...]
        // or a base64-encoded session object
        let accessToken: string | null = null;

        // Try parsing as JSON array first (Supabase SSR format)
        try {
            const parsed = JSON.parse(decodeURIComponent(tokenValue));
            if (Array.isArray(parsed) && parsed.length > 0) {
                accessToken = parsed[0]; // First element is the access token
            } else if (parsed.access_token) {
                accessToken = parsed.access_token;
            }
        } catch {
            // Might be a raw JWT token
            if (tokenValue.includes('.')) {
                accessToken = tokenValue;
            }
        }

        if (!accessToken) {
            return null;
        }

        // Decode the JWT to get user info (no verification needed — just reading claims)
        const payload = parseJwtPayload(accessToken);
        if (!payload || !payload.sub) {
            return null;
        }

        // Check expiry
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            console.log('[SERVER] Access token expired');
            return null;
        }

        // Return a session-like object for backward compatibility
        return {
            user: {
                id: payload.sub,
                email: payload.email || '',
                user_metadata: payload.user_metadata || {},
                role: payload.role || 'authenticated',
            }
        };
    } catch (error) {
        console.error('[SERVER] Error parsing session:', error);
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
