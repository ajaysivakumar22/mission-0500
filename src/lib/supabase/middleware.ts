import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/routine', '/tasks', '/goals', '/report', '/settings', '/admin', '/medals', '/onboarding'];

export async function updateSession(request: NextRequest) {
    const supabaseResponse = NextResponse.next({ request });

    // Check for auth session using cookies only — no network calls.
    const allCookies = request.cookies.getAll();
    const tokenCookie = allCookies.find(
        c => c.name.startsWith('sb-') && c.name.includes('-auth-token')
    );

    let hasValidAuth = false;

    if (tokenCookie) {
        try {
            let tokenValue = tokenCookie.value;
            let accessToken: string | null = null;

            try {
                const parsed = JSON.parse(decodeURIComponent(tokenValue));
                if (Array.isArray(parsed) && parsed.length > 0) accessToken = parsed[0];
                else if (parsed.access_token) accessToken = parsed.access_token;
            } catch {
                if (tokenValue.includes('.')) accessToken = tokenValue;
            }

            if (accessToken) {
                const parts = accessToken.split('.');
                if (parts.length === 3) {
                    // Use atob for Edge runtime compatibility
                    const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
                    const payload = JSON.parse(payloadStr);
                    if (payload.exp && payload.exp * 1000 > Date.now()) {
                        hasValidAuth = true;
                    }
                }
            }
        } catch {
            // Treat as invalid if parsing fails
        }
    }

    const pathname = request.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Redirect unauthenticated users away from protected routes
    if (!hasValidAuth && isProtectedRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        
        // Also clear the invalid cookie to be totally safe
        const response = NextResponse.redirect(redirectUrl);
        if (tokenCookie) {
            response.cookies.delete(tokenCookie.name);
        }
        return response;
    }

    // Redirect authenticated users away from login page to dashboard
    if (hasValidAuth && pathname === '/login') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
}
