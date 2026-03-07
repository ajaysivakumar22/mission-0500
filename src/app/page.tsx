import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import LandingPage from './LandingPage';

export default async function RootPage() {
    const session = await getServerSession();

    if (session?.user) {
        try {
            const { data } = await Promise.race([
                supabaseAdmin.from('users').select('role').eq('id', session.user.id).single(),
                new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 3000)),
            ]);
            if (data?.role === 'admin') {
                redirect('/admin');
            }
        } catch { /* fall through to dashboard redirect */ }

        redirect('/dashboard');
    }

    return <LandingPage />;
}
