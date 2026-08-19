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
            <div className="card p-5 flex flex-col justify-between h-full bg-gradient-to-br from-surface to-surface-muted border border-border">
                <p className="text-sm font-serif-quote italic text-textMain leading-relaxed mb-3">
                    &ldquo;{data.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-border/60 pt-2 mt-auto">
                    <p className="text-xs font-mono-tech text-accent uppercase tracking-widest font-bold">
                        — {data.author}
                    </p>
                    {data.context && (
                        <span className="text-[10px] font-mono-tech text-textMuted uppercase tracking-wider">
                            {data.context}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="card p-6 mb-2 bg-gradient-to-r from-surface via-surface to-surface-muted border-l-4 border-l-accent">
            <div className="flex gap-4 items-start">
                <span className="text-3xl text-accent flex-shrink-0 font-serif-quote leading-none mt-0.5" aria-hidden="true">
                    &#8220;
                </span>
                <div>
                    <blockquote className="text-base font-serif-quote italic text-textMain leading-relaxed mb-2">
                        {data.quote}
                    </blockquote>
                    <p className="text-xs font-mono-tech text-accent uppercase tracking-widest font-bold">
                        — {data.author}
                        {data.context && <span className="text-textMuted normal-case font-normal"> · {data.context}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}

