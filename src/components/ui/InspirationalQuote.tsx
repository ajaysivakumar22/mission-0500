import React from 'react';
import { Quote } from 'lucide-react';

interface InspirationalQuoteProps {
    quote: string;
    author: string;
    context?: string;
    bgImageUrl?: string;
}

export function InspirationalQuote({ quote, author, context, bgImageUrl }: InspirationalQuoteProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1D13]/80 p-8 shadow-2xl backdrop-blur-md transition-all hover:border-[#FFD60A]/30 mb-8 group">
            {bgImageUrl && (
                <div
                    className="absolute inset-0 z-0 opacity-[0.15] bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
                    style={{ backgroundImage: `url(${bgImageUrl})` }}
                />
            )}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0B1D13] to-transparent opacity-90" />

            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                    <div className="rounded-full bg-[#1B4332]/80 p-4 border border-[#FFD60A]/20 shadow-[0_0_15px_rgba(255,214,10,0.1)] transition-transform duration-500 group-hover:rotate-12">
                        <Quote className="h-8 w-8 text-[#FFD60A]" />
                    </div>
                </div>
                <div>
                    <blockquote className="text-xl md:text-2xl font-serif italic text-white leading-relaxed mb-4 text-shadow-sm">
                        "{quote}"
                    </blockquote>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-[#FFD60A] tracking-widest uppercase shadow-black drop-shadow-md">— {author}</span>
                        {context && <span className="text-sm text-[#9CA3AF] mt-1 uppercase tracking-wider font-semibold">{context}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
