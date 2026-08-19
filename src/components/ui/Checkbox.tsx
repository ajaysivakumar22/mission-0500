import React, { useId } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', id, checked, onChange, ...props }, ref) => {
        const generatedId = useId();
        const checkboxId = id || generatedId;

        return (
            <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        className={`appearance-none h-5 w-5 rounded-md border-2 border-border/80 bg-surface checked:bg-accent checked:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
                        {...props}
                    />
                    {checked && (
                        <Check className="absolute h-3.5 w-3.5 text-[#20382B] pointer-events-none stroke-[3.5]" />
                    )}
                </div>
                {label && (
                    <label htmlFor={checkboxId} className="text-sm text-textMain cursor-pointer select-none font-medium">
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
