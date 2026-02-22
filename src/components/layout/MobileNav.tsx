'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    RotateCcw,
    CheckSquare2,
    Target,
    FileText,
    Settings,
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/routine', label: 'Routine', icon: RotateCcw },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare2 },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/report', label: 'Report', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t border-[#1E3A2A] bg-[#0B1D13] lg:hidden z-50">
            <div className="flex justify-around">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-1 flex-col items-center justify-center py-3 text-xs font-medium transition-colors ${isActive
                                    ? 'border-t-2 border-[#FFD60A] text-[#FFD60A]'
                                    : 'text-[#6B7280]'
                                }`}
                        >
                            <Icon className="mb-1 h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
