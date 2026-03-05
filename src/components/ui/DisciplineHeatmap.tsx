'use client';

import React, { useEffect, useState } from 'react';
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

    // Ensure we always have `days` items in the grid
    const today = new Date();
    const timeline = Array.from({ length: days }, (_, i) => {
        const d = subDays(today, days - 1 - i);
        return format(d, 'yyyy-MM-dd');
    });

    const getIntensityClass = (value: number) => {
        if (value === 0) return 'bg-[#1E3A2A] border-[#0B1D13]'; // Empty state
        if (value < 33) return 'bg-[#FFD60A]/20 border-[#FFD60A]/10'; // Low activity
        if (value < 66) return 'bg-[#FFD60A]/50 border-[#FFD60A]/20'; // Medium
        if (value < 100) return 'bg-[#FFD60A]/80 border-[#FFD60A]/50'; // High
        return 'bg-[#FFD60A] border-[#FFF3B0] shadow-[0_0_10px_rgba(255,214,10,0.5)]'; // Perfect string
    };

    return (
        <div className="rounded-xl border border-[#1E3A2A] bg-[#162B20] p-6 relative">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-[#FFD60A]" />
                <h3 className="text-lg font-bold text-[#E8E8E8]">Discipline Heatmap (30 Days)</h3>
            </div>
            
            <div className="flex flex-wrap gap-[6px] mt-4 max-w-full justify-start md:justify-end">
                {timeline.map((dateStr, index) => {
                    const dayData = data?.find(d => d.date === dateStr);
                    const value = dayData ? dayData.value : 0;
                    const cssClass = getIntensityClass(value);
                    const isToday = index === timeline.length - 1;

                    return (
                        <div
                            key={dateStr}
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-sm sm:rounded border-2 transition-all duration-300 transform hover:scale-110 cursor-pointer ${cssClass} ${isToday ? 'animate-pulse ring-2 ring-white/20' : ''}`}
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipContent(`${format(parseISO(dateStr), 'MMM d, yyyy')}: ${value}%`);
                                setTooltipPos({
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 10,
                                });
                            }}
                            onMouseLeave={() => setTooltipContent(null)}
                        />
                    );
                })}
            </div>

            {tooltipContent && (
                <div 
                    className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-black/90 text-white text-xs py-1 px-2 rounded font-mono border border-[#FFD60A]/30 whitespace-nowrap shadow-xl"
                    style={{ left: tooltipPos.x, top: tooltipPos.y }}
                >
                    {tooltipContent}
                </div>
            )}
            
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-[#9CA3AF]">
                <span>Less</span>
                <div className="flex gap-[4px] sm:gap-[6px]">
                    <div className="w-3 h-3 bg-[#1E3A2A] border border-[#0B1D13] rounded-[2px]" />
                    <div className="w-3 h-3 bg-[#FFD60A]/20 border border-[#FFD60A]/10 rounded-[2px]" />
                    <div className="w-3 h-3 bg-[#FFD60A]/50 border border-[#FFD60A]/20 rounded-[2px]" />
                    <div className="w-3 h-3 bg-[#FFD60A]/80 border border-[#FFD60A]/50 rounded-[2px]" />
                    <div className="w-3 h-3 bg-[#FFD60A] border border-[#FFF3B0] rounded-[2px]" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}