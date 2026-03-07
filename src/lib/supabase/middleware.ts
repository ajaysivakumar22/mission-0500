import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/routine', '/tasks', '/goals', '/report', '/settings', '/admin', '/medals', '/onboarding'];

export async function updateSession(request: NextRequest) {
    const supabaseResponse = NextResponse.next({ request });

    // Check for auth session using cookies only — no network calls.
    // This keeps middleware fast. Actual session validation happens
    // in getServerSession() via local JWT parsing.
    const hasAuthCookie = request.cookies.getAll().some(
        c => c.name.startsWith('sb-') && c.name.includes('-auth-token')
    );

    const pathname = request.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(
        route => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Redirect unauthenticated users away from protected routes
    if (!hasAuthCookie && isProtectedRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from login page to dashboard
    if (hasAuthCookie && pathname === '/login') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        return NextResponse.redirect(redirectUrl);
    }

    return supabaseResponse;
}
