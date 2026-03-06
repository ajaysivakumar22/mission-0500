import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function RootPage() {
    const session = await getServerSession();

    if (session?.user) {
        const { data } = await supabaseAdmin.from('users').select('role').eq('id', session.user.id).single();
        if (data?.role === 'admin') {
            redirect('/admin');
        } else {
            redirect('/dashboard');
        }
    } else {
        redirect('/login');
    }
}
