'use client';

import { useState, useEffect } from 'react';
import { MobileNav, DesktopSidebar } from './MobileNav';

export function Navigation() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const roleCookie = document.cookie.split(';').find(c => c.trim().startsWith('user-role='));
        if (roleCookie?.includes('admin')) {
            setIsAdmin(true);
        }
    }, []);

    return (
        <>
            <DesktopSidebar isAdmin={isAdmin} />
            <MobileNav isAdmin={isAdmin} />
        </>
    );
}
