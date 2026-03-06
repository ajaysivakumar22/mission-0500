const fs = require('fs');
let content = \'use client';

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
    Award
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/routine', label: 'Routine', icon: RotateCcw },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare2 },
    { href: '/report', label: 'Report', icon: FileText },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/medals', label: 'Medals', icon: Award },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function MobileNav({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname();

    // Admins don't need the normal bottom nav anymore since they use admin layout
    if (isAdmin || pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-border/50 bg-background/80 px-4 py-3 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-lg">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={"group relative flex items-center justify-center rounded-xl p-3 transition-all duration-300 " + (
                                isActive
                                    ? "bg-surface shadow-[0_0_15px_rgba(var(--theme-accent),0.1)]"
                                    : "hover:bg-surface/50"
                            )}
                        >
                            <div className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-accent/30 bg-background px-3 py-1.5 text-xs font-bold tracking-widest text-accent opacity-0 transition-all duration-300 group-hover:-top-12 group-hover:opacity-100 shadow-xl">
                                {item.label}
                                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-accent/30 bg-background"></div>
                            </div>

                            <Icon className={"h-6 w-6 transition-colors duration-300 " + (
                                isActive ? "text-accent" : "text-textMuted group-hover:text-textMain"
                            )} />
                        </Link>
                    );
                })}

                <div className="h-8 w-px bg-border/60 mx-1"></div>

                <form action={async () => { await signOut(); }} className="flex">
                    <button
                        type="submit"
                        className="group relative flex items-center justify-center rounded-xl p-3 transition-all duration-300 hover:bg-red-900/20"
                    >
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
}\;
fs.writeFileSync('src/components/layout/MobileNav.tsx', content);
