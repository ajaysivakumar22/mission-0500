'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function Header() {
    const [dateStr, setDateStr] = useState('');

    useEffect(() => {
        const today = new Date();
        const d = today.getDate().toString().padStart(2, '0');
        const m = today.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
        const y = today.getFullYear();
        setDateStr(`${d} ${m} ${y}`);
    }, []);

    return (
        <header className="border-b border-border bg-surface/90 backdrop-blur-sm px-4 py-3 sticky top-0 z-30">
            <div className="flex items-center justify-between gap-3">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white text-xs font-black">M</span>
                    <div className="leading-none">
                        <span className="text-xs font-black text-textMain tracking-tight">MISSION</span>
                        <span className="text-xs font-mono-tech text-accent ml-1 tracking-widest">0500</span>
                    </div>
                </Link>

                {dateStr && (
                    <p className="text-xs font-mono-tech text-textMuted tracking-wider">{dateStr}</p>
                )}
            </div>
        </header>
    );
}
