import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    category?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, category, action }: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4 mb-6">
            <div>
                {category && (
                    <p className="font-mono-tech text-xs font-bold uppercase tracking-widest text-accent mb-1">
                        {category}
                    </p>
                )}
                <h1 className="text-xl sm:text-2xl font-black text-textMain tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-sm text-textSecondary leading-relaxed max-w-2xl">
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
