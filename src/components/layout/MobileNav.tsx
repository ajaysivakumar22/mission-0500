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

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-[#1E3A2A]/50 bg-[#0B1D13]/80 px-4 py-3 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-lg">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative flex items-center justify-center rounded-xl p-3 transition-all duration-300 ${isActive
                                ? 'bg-[#162B20] shadow-[inset_0_0_15px_rgba(255,214,10,0.1)]'
                                : 'hover:bg-[#162B20]/50'
                                }`}
                        >
                            {/* Floating Tooltip */}
                            <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#FFD60A]/30 bg-[#0B1D13] px-3 py-1.5 text-xs font-bold tracking-widest text-[#FFD60A] opacity-0 transition-all duration-300 group-hover:-top-12 group-hover:opacity-100 shadow-xl">
                                {item.label}
                                {/* Tooltip Caret */}
                                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-[#FFD60A]/30 bg-[#0B1D13]"></div>
                            </div>

                            <Icon className={`h-6 w-6 transition-colors duration-300 ${isActive ? 'text-[#FFD60A]' : 'text-[#6B7280] group-hover:text-white'
                                }`} />
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="h-8 w-px bg-[#1E3A2A]/60 mx-1"></div>

                <form action={async () => { await signOut(); }} className="flex">
                    <button
                        type="submit"
                        className="group relative flex items-center justify-center rounded-xl p-3 transition-all duration-300 hover:bg-red-900/20"
                    >
                        {/* Floating Tooltip for Logout */}
                        <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-red-500/30 bg-[#0B1D13] px-3 py-1.5 text-xs font-bold tracking-widest text-red-500 opacity-0 transition-all duration-300 group-hover:-top-12 group-hover:opacity-100 shadow-xl">
                            LOGOUT
                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-red-500/30 bg-[#0B1D13]"></div>
                        </div>

                        <LogOut className="h-6 w-6 text-[#6B7280] transition-colors duration-300 group-hover:text-red-500" />
                    </button>
                </form>
            </div>
        </nav>
    );
}
