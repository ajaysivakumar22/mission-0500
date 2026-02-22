import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className = '', ...props }, ref) => {
        return (
            <div className="flex items-center gap-2">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className="appearance-none h-5 w-5 rounded border border-[#1E3A2A] bg-[#0B1D13] checked:bg-[#1B4332] checked:border-[#1B4332] focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-opacity-20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        {...props}
                    />
                    {props.checked && (
                        <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-[#FFD60A] pointer-events-none" />
                    )}
                </div>
                {label && (
                    <label className="text-sm text-[#E8E8E8] cursor-pointer">
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
