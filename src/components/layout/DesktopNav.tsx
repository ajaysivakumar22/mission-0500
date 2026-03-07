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
    LogOut,
    Award
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/routine', label: 'Routine', icon: RotateCcw },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare2 },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/report', label: 'Report', icon: FileText },
    { href: '/medals', label: 'Medals', icon: Award },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function DesktopNav() {
    const pathname = usePathname();

    return (
        <nav className="hidden w-64 flex-col border-r border-border bg-background px-4 py-6 lg:flex">
            {/* Logo */}
            <div className="mb-8 px-4">
                <h1 className="text-xl font-bold text-accent">MISSION 0500</h1>
                <p className="text-xs text-textMuted">Personal Command Center</p>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-1 flex-col space-y-2">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary text-accent'
                                : 'text-textMuted hover:bg-surface hover:text-textMain'
                                }`}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Logout Button */}
            <button
                type="button"
                onClick={() => {
                    document.cookie.split(';').forEach(c => {
                        const name = c.trim().split('=')[0];
                        if (name.startsWith('sb-') && name.includes('-auth-token')) {
                            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
                        }
                    });
                    document.cookie = 'user-role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                    window.location.href = '/login';
                }}
                className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-textMuted hover:bg-surface hover:text-textMain"
            >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
            </button>
        </nav>
    );
}
