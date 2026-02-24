import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/login'];
const protectedRoutes = ['/dashboard', '/routine', '/tasks', '/goals', '/report', '/settings'];

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set({ name, value, ...options })
                    );
                },
            },
        }
    );

    let user = null;
    let authError = null;
    try {
        const result = await supabase.auth.getUser();
        user = result.data.user;
        authError = result.error;
    } catch (e: any) {
        authError = e;
    }

    const pathname = request.nextUrl.pathname;

    console.log('\n\n\n------------------- MIDDLEWARE LOG -------------------');
    console.log(`Path: ${pathname}`);
    console.log(`URL env: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    console.log(`Cookies count: ${request.cookies.getAll().length}`);
    const authCookies = request.cookies.getAll().filter(c => c.name.includes('auth-token'));
    console.log(`Auth cookies total matched: ${authCookies.length}`);
    for (const c of authCookies) {
        console.log(` - ${c.name} : length ${c.value.length}`);
    }
    console.log(`User found: ${!!user}`);
    if (authError) console.log(`Auth Error Details:`, authError);
    console.log('------------------------------------------------------\n\n\n');

    // Redirect unauthenticated users trying to access protected routes
    /*
    if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
        console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to /login`);
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        const response = NextResponse.redirect(redirectUrl);
        // Copy cookies to ensure any session updates are preserved
        // (though in this case we are mostly clearing or handling no-session)
        const cookies = supabaseResponse.cookies.getAll();
        cookies.forEach(cookie => response.cookies.set(cookie.name, cookie.value, cookie));
        return response;
    }
    */

    // Redirect authenticated users away from login
    /*
    if (user && pathname === '/login') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        const response = NextResponse.redirect(redirectUrl);
        // IMPORTANT: Copy cookies from supabaseResponse to preserve session
        const cookies = supabaseResponse.cookies.getAll();
        cookies.forEach(cookie => response.cookies.set(cookie.name, cookie.value, cookie));
        return response;
    }
    */

    // Redirect root to dashboard if authenticated, login if not
    /*
    if (pathname === '/') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = user ? '/dashboard' : '/login';
        const response = NextResponse.redirect(redirectUrl);
        // IMPORTANT: Copy cookies from supabaseResponse to preserve session
        const cookies = supabaseResponse.cookies.getAll();
        cookies.forEach(cookie => response.cookies.set(cookie.name, cookie.value, cookie));
        return response;
    }
    */

    return supabaseResponse;
}
