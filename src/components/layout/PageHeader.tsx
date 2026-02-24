import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="mb-8 border-b border-white/10 pb-6 relative z-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#9CA3AF] tracking-tight uppercase drop-shadow-sm">
                {title}
            </h1>
            {subtitle && (
                <p className="mt-2 text-lg text-[#9CA3AF] max-w-2xl font-medium tracking-wide">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
