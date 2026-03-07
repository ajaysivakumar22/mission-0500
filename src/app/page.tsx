import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getServerSession } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import LandingPage from './LandingPage';

export default async function RootPage() {
    const session = await getServerSession();

    if (session?.user) {
        let isAdmin = false;
        
        try {
            const cookieStore = await cookies();
            if (cookieStore.get('user-role')?.value === 'admin') {
                isAdmin = true;
            }
        } catch { /* ignore cookie error */ }

        if (!isAdmin) {
            try {
                const { data } = await Promise.race([
                    supabaseAdmin.from('users').select('role').eq('id', session.user.id).single(),
                    new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 3000)),
                ]);
                if (data?.role === 'admin') {
                    isAdmin = true;
                }
            } catch { /* fall through to dashboard redirect */ }
        }

        if (isAdmin) {
            redirect('/admin');
        } else {
            redirect('/dashboard');
        }
    }

    return <LandingPage />;
}
