'use client';

import React from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { getDailyQuote, QuoteItem } from '@/lib/constants/quotes';

interface InspirationalQuoteProps {
    quote?: string;
    author?: string;
    context?: string;
    /** Compact mode: fits inside a stat grid cell */
    compact?: boolean;
}

export function InspirationalQuote({ quote: quoteProp, author: authorProp, context: contextProp, compact = false }: InspirationalQuoteProps) {
    const { theme } = useTheme();

    let data: QuoteItem;
    if (quoteProp && authorProp) {
        data = { quote: quoteProp, author: authorProp, context: contextProp };
    } else {
        data = getDailyQuote(theme);
    }

    if (compact) {
        return (
            <div className="card p-5 flex flex-col justify-between h-full">
                <p className="text-sm font-serif-quote italic text-textSecondary leading-relaxed mb-3">
                    &ldquo;{data.quote}&rdquo;
                </p>
                <p className="text-xs font-mono-tech text-accent uppercase tracking-widest">
                    — {data.author}
                </p>
            </div>
        );
    }

    return (
        <div className="card p-6 mb-2">
            <div className="flex gap-4 items-start">
                <span className="text-2xl text-accent flex-shrink-0 font-serif-quote leading-none mt-0.5" aria-hidden="true">
                    &#8220;
                </span>
                <div>
                    <blockquote className="text-base font-serif-quote italic text-textSecondary leading-relaxed mb-3">
                        {data.quote}
                    </blockquote>
                    <p className="text-xs font-mono-tech text-accent uppercase tracking-widest">
                        — {data.author}
                        {data.context && <span className="text-textMuted normal-case"> · {data.context}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}
