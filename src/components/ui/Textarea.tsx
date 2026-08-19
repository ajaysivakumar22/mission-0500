import React from 'react';

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-textMain placeholder:text-textMuted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none disabled:opacity-50 ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
