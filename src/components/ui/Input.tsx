import React from 'react';

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    suppressHydrationWarning
                    className={`w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-textMain placeholder:text-textMuted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:bg-surface-muted ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
