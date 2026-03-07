'use client';

import { useState, useEffect } from 'react';
import { MobileNav } from './MobileNav';

export function Navigation() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check cookie instantly — no network call needed
        const roleCookie = document.cookie.split(';').find(c => c.trim().startsWith('user-role='));
        if (roleCookie?.includes('admin')) {
            setIsAdmin(true);
        }
    }, []);

    return <MobileNav isAdmin={isAdmin} />;
}
