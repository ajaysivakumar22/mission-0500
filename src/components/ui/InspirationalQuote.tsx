'use client';

import React from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { getQuoteForContext, QuoteItem } from '@/lib/constants/quotes';

interface InspirationalQuoteProps {
    quote?: string;
    author?: string;
    context?: string;
    pageKey?: string;
    /** Compact mode: fits inside a stat grid cell */
    compact?: boolean;
}

export function InspirationalQuote({
    quote: quoteProp,
    author: authorProp,
    context: contextProp,
    pageKey = 'global',
    compact = false
}: InspirationalQuoteProps) {
    const { theme } = useTheme();

    let data: QuoteItem;
    if (quoteProp && authorProp) {
        data = { quote: quoteProp, author: authorProp, context: contextProp };
    } else {
        data = getQuoteForContext(theme, pageKey);
    }

    if (compact) {
        return (
            <div className="card p-4 sm:p-4.5 flex flex-col justify-between h-full bg-gradient-to-br from-surface to-surface-muted border border-border">
                <p className="text-xs sm:text-sm font-serif-quote italic text-textMain leading-snug mb-2.5">
                    &ldquo;{data.quote}&rdquo;
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-border/60 pt-2 mt-auto">
                    <p className="text-xs font-mono-tech text-accent uppercase tracking-wider font-bold truncate">
                        — {data.author}
                    </p>
                    {data.context && (
                        <span className="text-xs font-mono-tech text-textMuted uppercase tracking-wider font-semibold flex-shrink-0">
                            {data.context}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="card p-4 sm:p-5 mb-2 bg-gradient-to-r from-surface via-surface to-surface-muted border-l-4 border-l-accent">
            <div className="flex gap-3.5 items-start">
                <span className="text-2xl sm:text-3xl text-accent flex-shrink-0 font-serif-quote leading-none mt-0.5" aria-hidden="true">
                    &#8220;
                </span>
                <div className="flex-1 min-w-0">
                    <blockquote className="text-sm sm:text-base font-serif-quote italic text-textMain leading-snug mb-2">
                        {data.quote}
                    </blockquote>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-border/40 pt-2 mt-1">
                        <p className="text-xs font-mono-tech text-accent uppercase tracking-wider font-bold truncate">
                            — {data.author}
                        </p>
                        {data.context && (
                            <span className="text-xs font-mono-tech text-textMuted uppercase tracking-wider font-semibold flex-shrink-0">
                                {data.context}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
