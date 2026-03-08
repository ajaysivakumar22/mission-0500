import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import AdminLogoutButton from '@/components/layout/AdminLogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();

    if (!session?.user) {
        redirect('/login');
    }

    const cookieStore = await cookies();
    const userRoleCookie = cookieStore.get('user-role')?.value;

    let isAdmin = userRoleCookie === 'admin';

    // Verify DB if not cached in cookie
    if (!isAdmin) {
        try {
            const timeoutPromise = new Promise<{ data: any }>(resolve => setTimeout(() => resolve({ data: null }), 3000));
            const { data: profile } = await Promise.race([
                supabaseAdmin.from('users').select('role').eq('id', session.user.id).single(),
                timeoutPromise
            ]);

            if (profile?.role === 'admin') {
                isAdmin = true;
            }
        } catch { /* ignore network error */ }
    }

    if (!isAdmin) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-background text-textMain flex flex-col">
            <header className="bg-surface border-b border-border px-6 py-4 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-black text-accent uppercase tracking-widest">
                        MISSION 0500: COMMAND CENTER
                    </h1>
                    <div className="flex gap-4">
                        <AdminLogoutButton />
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full px-6 py-6 md:px-8 md:py-8">
                {children}
            </main>
        </div>
    );
}
