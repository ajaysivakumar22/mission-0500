import React from 'react';

interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', id, ...props }, ref) => {
        const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-textSecondary mb-1.5">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-textMain transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer disabled:opacity-50 ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''} ${className}`}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value} className="bg-surface text-textMain py-1">
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1.5 text-xs text-danger font-medium">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
