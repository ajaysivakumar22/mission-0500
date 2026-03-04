import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/routine', '/tasks', '/goals', '/report', '/settings'];

// Supabase project ref extracted from the URL
const SUPABASE_PROJECT_REF = 'ybuilowmhnrwkzrfhbwb';

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

    // Redirect authenticated users away from the login page
    if (hasAuthCookie && pathname === '/login') {
        console.log('[MIDDLEWARE] Auth cookie found, redirecting to /dashboard from /login');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
}
