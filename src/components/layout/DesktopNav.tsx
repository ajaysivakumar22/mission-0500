'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/server/actions/auth';
import {
    LayoutDashboard,
    RotateCcw,
    CheckSquare2,
    Target,
    FileText,
    Settings,
    LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/routine', label: 'Routine', icon: RotateCcw },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare2 },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/report', label: 'Report', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function DesktopNav() {
    const pathname = usePathname();

    return (
        <nav className="hidden w-64 flex-col border-r border-[#1E3A2A] bg-[#0B1D13] px-4 py-6 lg:flex">
            {/* Logo */}
            <div className="mb-8 px-4">
                <h1 className="text-xl font-bold text-[#FFD60A]">MISSION 0500</h1>
                <p className="text-xs text-[#6B7280]">Personal Command Center</p>
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
                                ? 'bg-[#1B4332] text-[#FFD60A]'
                                : 'text-[#9CA3AF] hover:bg-[#162B20] hover:text-[#E8E8E8]'
                                }`}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Logout Button */}
            <form action={async () => { await signOut(); }}>
                <button
                    type="submit"
                    className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-[#9CA3AF] hover:bg-[#162B20] hover:text-[#E8E8E8]"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </form>
        </nav>
    );
}
