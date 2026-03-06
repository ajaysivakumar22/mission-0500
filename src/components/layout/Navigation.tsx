'use client';

import { useState, useEffect } from 'react';
import { MobileNav } from './MobileNav';
import { createClient } from '@/lib/supabase/client';

export function Navigation() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
                if (data?.role === 'admin') {
                    setIsAdmin(true);
                }
            }
        };
        checkAdmin();
    }, []);

    return <MobileNav isAdmin={isAdmin} />;
}
