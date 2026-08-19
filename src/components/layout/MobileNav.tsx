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
    Award,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/routine', label: 'Routine', icon: RotateCcw },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare2 },
    { href: '/goals', label: 'Goals', icon: Target },
    { href: '/report', label: 'Report', icon: FileText },
    { href: '/medals', label: 'Medals', icon: Award },
    { href: '/settings', label: 'Settings', icon: Settings },
];

function handleLogout() {
    document.cookie.split(';').forEach(c => {
        const name = c.trim().split('=')[0];
        if (name.startsWith('sb-') && name.includes('-auth-token')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
    });
    document.cookie = 'user-role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.href = '/login';
}

/** Desktop Sidebar — Deep Olive (#20382B) as in North Star image */
export function DesktopSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname();

    if (isAdmin || pathname.startsWith('/admin')) return null;

    return (
        <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen h-[100dvh] bg-[#20382B] text-[#F8F4EB] sticky top-0 z-30 shadow-xl">
            {/* Brand Logo Header */}
            <div className="px-6 py-6 border-b border-white/10">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D6A52C] text-[#20382B] font-black shadow-md">
                        <Shield className="h-5 w-5 fill-[#20382B]" />
                    </div>
                    <div>
                        <span className="text-xs font-mono-tech text-[#D6A52C] uppercase tracking-widest block leading-none">MISSION</span>
                        <span className="text-lg font-black tracking-wider block text-white leading-tight">0500</span>
                    </div>
                </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 px-3 space-y-1" aria-label="Main Navigation">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                                isActive
                                    ? 'bg-white/15 text-[#D6A52C] shadow-inner'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#D6A52C]"
                                    transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                                />
                            )}
                            <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-[#D6A52C]' : 'text-white/60 group-hover:text-white'}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Rank Card at bottom of sidebar */}
            <div className="p-4 mx-3 mb-4 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-mono-tech text-[10px] text-[#D6A52C] uppercase tracking-widest">RANK</span>
                    <span className="font-bold text-white">CADET</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden mt-1.5">
                    <div className="h-full bg-[#D6A52C] rounded-full w-1/4" />
                </div>
            </div>

            {/* Logout */}
            <div className="p-3 border-t border-white/10">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/60 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150"
                    aria-label="Sign out"
                >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

/** Mobile Bottom Nav — visible on <lg */
export function MobileNav({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname();

    if (isAdmin || pathname.startsWith('/admin')) return null;

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed bottom-4 left-1/2 z-50 lg:hidden rounded-2xl border border-white/15 bg-[#20382B]/95 px-2 py-1.5 shadow-2xl backdrop-blur-md text-white"
            aria-label="Main Navigation"
        >
            <div className="flex items-center gap-0.5">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group relative flex items-center justify-center rounded-xl p-2.5 transition-colors duration-200"
                            aria-label={item.label}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-active"
                                    className="absolute inset-0 rounded-xl bg-white/20"
                                    transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                                />
                            )}
                            <Icon className={`relative z-10 h-5 w-5 transition-colors duration-200 ${isActive ? 'text-[#D6A52C]' : 'text-white/70 group-hover:text-white'}`} />
                        </Link>
                    );
                })}

                <div className="h-5 w-px bg-white/20 mx-1" />

                <button
                    type="button"
                    onClick={handleLogout}
                    className="group relative flex items-center justify-center rounded-xl p-2.5 transition-colors duration-200 hover:bg-red-500/20"
                    aria-label="Sign out"
                >
                    <LogOut className="h-5 w-5 text-white/70 transition-colors duration-200 group-hover:text-red-300" />
                </button>
            </div>
        </motion.nav>
    );
}
