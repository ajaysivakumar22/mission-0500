'use client';

import React from 'react';
import { getOperationalDateString } from '@/lib/utils/date';

interface OperationalDateProps {
    label?: string;
    date?: string;
    className?: string;
}

/**
 * Shared Operational Date Component for All Non-Dashboard Pages
 * 
 * Enforces unified typography, contrast, badge treatment, and metadata hierarchy
 * across Routine, Tasks, Goals, Report, Medals, and Settings.
 */
export function OperationalDate({ label, date, className = '' }: OperationalDateProps) {
    const dateStr = date || getOperationalDateString();

    return (
        <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
            {label && (
                <span className="font-mono-tech text-[10px] sm:text-xs font-bold text-accent uppercase tracking-widest block leading-none">
                    {label}
                </span>
            )}
            {label && (
                <span className="text-textMuted/70 text-xs font-mono-tech select-none">•</span>
            )}
            <span className="font-mono-tech text-[10px] sm:text-xs font-bold uppercase tracking-wider text-textMuted bg-surface-muted/90 px-2.5 py-0.5 rounded border border-border/80 shadow-xs leading-none">
                {dateStr}
            </span>
        </div>
    );
}
