import React from 'react';

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', isLoading = false, className = '', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary: 'bg-[#1B4332] text-[#FFD60A] hover:bg-[#2D5F4C]',
            secondary: 'bg-[#162B20] text-[#E8E8E8] border border-[#1E3A2A] hover:border-[#1B4332]',
            ghost: 'text-[#9CA3AF] hover:text-[#E8E8E8]',
            danger: 'bg-red-900 text-red-200 hover:bg-red-800',
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-base',
            lg: 'px-6 py-3 text-lg',
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? 'Loading...' : props.children}
            </button>
        );
    }
);

Button.displayName = 'Button';
