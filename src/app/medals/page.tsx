import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/supabase/server';
import { getEarnedMedals } from '@/server/services/medals-service';
import MedalsClient from './MedalsClient';

export default async function MedalsPage() {
    const session = await getServerSession();
    if (!session?.user) {
        redirect('/login');
    }

    const result = await getEarnedMedals(session.user.id);
    const earnedMedals = result.success && result.data ? result.data : [];

    return <MedalsClient earnedMedals={earnedMedals} />;
}
