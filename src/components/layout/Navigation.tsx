'use client';

import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { MobileNav } from './MobileNav';
import { DesktopNav } from './DesktopNav';

export function Navigation() {
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    if (!isDesktop) {
        return <MobileNav />;
    }

    return <DesktopNav />;
}
