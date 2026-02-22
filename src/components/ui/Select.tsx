import React from 'react';

interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[#E8E8E8] mb-2">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`w-full rounded-lg border border-[#1E3A2A] bg-[#0B1D13] px-4 py-2 text-[#E8E8E8] focus:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-opacity-20 ${className}`}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';
