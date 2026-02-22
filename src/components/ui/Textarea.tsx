import React from 'react';

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[#E8E8E8] mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`w-full rounded-lg border border-[#1E3A2A] bg-[#0B1D13] px-4 py-2 text-[#E8E8E8] placeholder-[#6B7280] focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-opacity-20 resize-none ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
