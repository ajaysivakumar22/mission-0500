'use client';

import { useEffect, useState } from 'react';
import { getQuoteOfTheDay } from '@/lib/constants/motivational-quotes';

interface HeaderProps {
    title?: string;
}

export function Header({ title }: HeaderProps) {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const dailyQuote = getQuoteOfTheDay(today);
        setQuote(dailyQuote.text);
    }, []);

    return (
        <div className="border-b border-[#1E3A2A] bg-[#162B20] px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#E8E8E8]">
                    {title || 'MISSION 0500'}
                </h1>
            </div>
            {quote && (
                <p className="mt-2 text-sm italic text-[#9CA3AF]">&quot;{quote}&quot;</p>
            )}
        </div>
    );
}
