'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    rounded = 'lg',
    className,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500 shadow-lg hover:shadow-xl active:scale-[0.98]',
      secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500 shadow-md hover:shadow-lg',
      ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400',
      glass: 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-md text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-900/20 focus:ring-white/50',
      gradient: 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 focus:ring-purple-500 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3'
    };

    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: variant === 'gradient' ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        onClick={props.onClick}
        onBlur={props.onBlur}
        onFocus={props.onFocus}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        type={props.type}
        name={props.name}
        value={props.value}
        id={props.id}
        form={props.form}
        formAction={props.formAction}
        formEncType={props.formEncType}
        formMethod={props.formMethod}
        formNoValidate={props.formNoValidate}
        formTarget={props.formTarget}
        aria-label={props['aria-label']}
        aria-pressed={props['aria-pressed']}
      >
        {/* Ripple effect on click */}
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          <span className="absolute inset-0 rounded-inherit bg-current opacity-0 hover:opacity-10 transition-opacity" />
        </span>

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {loading ? (
            <svg
              className={clsx('animate-spin', iconSizes[size])}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : Icon && iconPosition === 'left' ? (
            <Icon className={iconSizes[size]} />
          ) : null}

          {children}

          {!loading && Icon && iconPosition === 'right' && (
            <Icon className={iconSizes[size]} />
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;