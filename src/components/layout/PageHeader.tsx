import React from 'react';
import { OperationalDate } from '@/components/ui/OperationalDate';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    category?: string;
    date?: string;
    showOperationalDate?: boolean;
    action?: React.ReactNode;
}

export function PageHeader({
    title,
    subtitle,
    category,
    date,
    showOperationalDate = false,
    action
}: PageHeaderProps) {
    const shouldShowDate = showOperationalDate || Boolean(date) || Boolean(category);

    return (
        <div className="flex items-start justify-between gap-4 mb-6 pb-2 border-b border-border/50">
            <div>
                {shouldShowDate && (
                    <div className="mb-1.5">
                        <OperationalDate label={category} date={date} />
                    </div>
                )}
                <h1 className="text-2xl sm:text-3xl font-serif-quote font-bold text-textMain tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-xs sm:text-sm text-textSecondary leading-relaxed max-w-2xl font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && (
                <div className="flex-shrink-0">{action}</div>
            )}
        </div>
    );
}


