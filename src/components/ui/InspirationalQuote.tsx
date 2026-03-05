'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { getDailyQuote, QuoteItem } from '@/lib/constants/quotes';

interface InspirationalQuoteProps {
    // Making these optional now, so it can auto-fetch based on theme.
    quote?: string;
    author?: string;
    context?: string;
    bgImageUrl?: string;
}

export function InspirationalQuote(props: InspirationalQuoteProps) {
    const { theme } = useTheme();

    // Auto-fetch if no explicit quote is provided
    let data: QuoteItem;
    if (props.quote && props.author) {
        data = {
            quote: props.quote,
            author: props.author,
            context: props.context,
            bgImageUrl: props.bgImageUrl
        };
    } else {
        data = getDailyQuote(theme);
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-2xl backdrop-blur-md transition-all hover:border-accent/40 mb-8 group">
            {data.bgImageUrl && (
                <div
                    className="absolute inset-0 z-0 opacity-[0.10] bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
                    style={{ backgroundImage: `url(${data.bgImageUrl})` }}
                />
            )}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-background to-transparent opacity-90" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                    <div className="rounded-full bg-primary/20 p-4 border border-accent/20 shadow-[0_0_15px_rgba(var(--theme-accent),0.1)] transition-transform duration-500 group-hover:rotate-12">
                        <Quote className="h-8 w-8 text-accent" />
                    </div>
                </div>
                <div>
                    <blockquote className="text-xl md:text-2xl font-serif italic text-textMain leading-relaxed mb-4 text-shadow-sm">
                        "{data.quote}"
                    </blockquote>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-accent tracking-widest uppercase shadow-black drop-shadow-md">— {data.author}</span>
                        {data.context && <span className="text-sm text-textMuted mt-1 uppercase tracking-wider font-semibold">{data.context}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
