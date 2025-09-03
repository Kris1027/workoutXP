'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const actionButtonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group/btn',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-blue-600 to-blue-500',
          'hover:from-blue-500 hover:to-blue-400',
          'text-white shadow-lg hover:shadow-xl',
          'border border-blue-400/20',
          'hover:-translate-y-0.5',
          'active:translate-y-0',
        ].join(' '),
        danger: [
          'bg-gradient-to-r from-red-600 to-red-500',
          'hover:from-red-500 hover:to-red-400',
          'text-white shadow-lg hover:shadow-xl',
          'border border-red-400/20',
          'hover:-translate-y-0.5',
          'active:translate-y-0',
        ].join(' '),
        success: [
          'bg-gradient-to-r from-green-600 to-green-500',
          'hover:from-green-500 hover:to-green-400',
          'text-white shadow-lg hover:shadow-xl',
          'border border-green-400/20',
          'hover:-translate-y-0.5',
          'active:translate-y-0',
        ].join(' '),
        ghost: [
          'bg-white/5 backdrop-blur-sm',
          'hover:bg-white/10',
          'text-gray-700 dark:text-gray-200',
          'border border-gray-200/50 dark:border-gray-700/50',
          'hover:border-gray-300 dark:hover:border-gray-600',
          'hover:shadow-md',
        ].join(' '),
        outline: [
          'bg-transparent',
          'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100',
          'dark:hover:from-gray-800 dark:hover:to-gray-700',
          'text-gray-700 dark:text-gray-200',
          'border-2 border-gray-300 dark:border-gray-600',
          'hover:border-gray-400 dark:hover:border-gray-500',
          'hover:shadow-md',
        ].join(' '),
        glass: [
          'bg-white/10 backdrop-blur-md',
          'hover:bg-white/20',
          'text-gray-700 dark:text-white',
          'border border-white/20 dark:border-white/10',
          'shadow-lg hover:shadow-xl',
          'hover:-translate-y-0.5',
        ].join(' '),
      },
      size: {
        xs: 'text-xs px-2.5 py-1.5 rounded-md',
        sm: 'text-sm px-3 py-2 rounded-lg',
        md: 'text-sm px-4 py-2.5 rounded-lg',
        lg: 'text-base px-6 py-3 rounded-xl',
        xl: 'text-lg px-8 py-4 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  ripple?: boolean;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    children, 
    icon,
    iconPosition = 'left',
    loading = false,
    ripple = true,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = React.useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        
        setRipples(prev => [...prev, { x, y, id }]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
      }
      
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(actionButtonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effect */}
        {ripple && ripples.map(({ x, y, id }) => (
          <span
            key={id}
            className="absolute pointer-events-none"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="block animate-ripple rounded-full bg-white/30 w-2 h-2" />
          </span>
        ))}

        {/* Shimmer effect for primary variants */}
        {(variant === 'primary' || variant === 'danger' || variant === 'success') && (
          <span className="absolute inset-0 -top-[2px] h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
        )}

        {/* Loading spinner */}
        {loading && (
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {!loading && icon && iconPosition === 'left' && icon}
          {children}
          {!loading && icon && iconPosition === 'right' && icon}
        </span>
      </button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton, actionButtonVariants };