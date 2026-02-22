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
                setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Redirect unauthenticated users trying to access protected routes
    if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/login';
        const response = NextResponse.redirect(redirectUrl);
        // Copy cookies to ensure any session updates are preserved
        // (though in this case we are mostly clearing or handling no-session)
        const cookies = supabaseResponse.cookies.getAll();
        cookies.forEach(cookie => response.cookies.set(cookie.name, cookie.value, cookie));
        return response;
    }

    // Redirect authenticated users away from login
    if (user && pathname === '/login') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/dashboard';
        const response = NextResponse.redirect(redirectUrl);
        // IMPORTANT: Copy cookies from supabaseResponse to preserve session
        const cookies = supabaseResponse.cookies.getAll();
        cookies.forEach(cookie => response.cookies.set(cookie.name, cookie.value, cookie));
        return response;
    }

    // Redirect root to dashboard if authenticated, login if not
    if (pathname === '/') {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = user ? '/dashboard' : '/login';
        const response = NextResponse.redirect(redirectUrl);
        // IMPORTANT: Copy cookies from supabaseResponse to preserve session
        const cookies = supabaseResponse.cookies.getAll();
        cookies.forEach(cookie => response.cookies.set(cookie.name, cookie.value, cookie));
        return response;
    }

    return supabaseResponse;
}
