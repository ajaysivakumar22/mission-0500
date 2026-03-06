import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/routine', '/tasks', '/goals', '/report', '/settings', '/admin'];

// Extract project ref from the Supabase URL env var
const SUPABASE_PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] || '';

export async function updateSession(request: NextRequest) {
    const supabaseResponse = NextResponse.next({
        request,
    });

    const pathname = request.nextUrl.pathname;

    // Check for Supabase auth cookie directly — no network calls needed.
    // The browser Supabase client stores the session in cookies named:
    //   sb-<project-ref>-auth-token       (single cookie)
    //   sb-<project-ref>-auth-token.0     (chunked cookies)
    const allCookies = request.cookies.getAll();
    const hasAuthCookie = allCookies.some(
        cookie => cookie.name.startsWith(`sb-${SUPABASE_PROJECT_REF}-auth-token`)
    );

    // Segment-safe route logic (prefix based matching)
    const isProtectedRoute = protectedRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Redirect unauthenticated users trying to access protected routes
    if (!hasAuthCookie && isProtectedRoute) {
        console.log('[MIDDLEWARE] No auth cookie found, redirecting to /login from:', pathname);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from the login page is handled client-side now
    // to prevent infinite redirect loops caused by stale edge-case cookies.

    return supabaseResponse;
}
