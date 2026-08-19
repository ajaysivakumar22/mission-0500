'use client';

import React, { useState } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { Activity } from 'lucide-react';

interface HeatmapData {
    date: string;
    value: number; // 0-100
}

interface HeatmapProps {
    data: HeatmapData[];
    days?: number;
}

export function DisciplineHeatmap({ data, days = 30 }: HeatmapProps) {
    const [tooltipContent, setTooltipContent] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const today = new Date();
    const timeline = Array.from({ length: days }, (_, i) => {
        const d = subDays(today, days - 1 - i);
        return format(d, 'yyyy-MM-dd');
    });

    const getIntensityStyle = (value: number) => {
        if (value === 0) return { backgroundColor: '#E0D9CB', borderColor: '#D3CBBD' }; // Empty
        if (value < 33) return { backgroundColor: '#C5D5C0', borderColor: '#B2C6AC' }; // Low
        if (value < 66) return { backgroundColor: '#93AB8E', borderColor: '#819B7C' }; // Medium
        if (value < 100) return { backgroundColor: '#71866B', borderColor: '#5C7156' }; // High (Sage)
        return { backgroundColor: '#20382B', borderColor: '#172B20' }; // Perfect (Deep Olive)
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#71866B]" />
                    <span className="font-mono-tech text-xs font-bold text-textMuted uppercase tracking-widest">
                        DISCIPLINE HEATMAP ({days} DAYS)
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 mt-2">
                {timeline.map((dateStr, index) => {
                    const dayData = data?.find(d => d.date === dateStr);
                    const value = dayData ? dayData.value : 0;
                    const style = getIntensityStyle(value);
                    const isToday = index === timeline.length - 1;

                    return (
                        <div
                            key={dateStr}
                            style={style}
                            className={`h-7 rounded border transition-all duration-200 hover:scale-110 cursor-pointer ${
                                isToday ? 'ring-2 ring-accent' : ''
                            }`}
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipContent(`${format(parseISO(dateStr), 'MMM d, yyyy')}: ${value}%`);
                                setTooltipPos({
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 8,
                                });
                            }}
                            onMouseLeave={() => setTooltipContent(null)}
                        />
                    );
                })}
            </div>

            {tooltipContent && (
                <div
                    className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-surface-dark text-[#F8F4EB] text-xs py-1 px-2.5 rounded font-mono shadow-xl border border-white/20 whitespace-nowrap"
                    style={{ left: tooltipPos.x, top: tooltipPos.y }}
                >
                    {tooltipContent}
                </div>
            )}

            <div className="flex items-center justify-between mt-3 text-[11px] text-textMuted font-mono-tech">
                <span>Less</span>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#E0D9CB', borderColor: '#D3CBBD' }} />
                    <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#C5D5C0', borderColor: '#B2C6AC' }} />
                    <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#93AB8E', borderColor: '#819B7C' }} />
                    <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#71866B', borderColor: '#5C7156' }} />
                    <div className="w-3 h-3 rounded border" style={{ backgroundColor: '#20382B', borderColor: '#172B20' }} />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}