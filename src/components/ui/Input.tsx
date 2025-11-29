'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Search, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: LucideIcon;
  clearable?: boolean;
  onClear?: () => void;
  variant?: 'default' | 'ghost' | 'glass';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    error,
    helper,
    icon: Icon,
    clearable = false,
    onClear,
    variant = 'default',
    inputSize = 'md',
    className,
    ...props
  }, ref) => {
    const baseStyles = 'w-full transition-all duration-200 focus:outline-none';

    const variants = {
      default: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20',
      ghost: 'bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 rounded-none px-0',
      glass: 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/20 dark:border-gray-700/20 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20',
    };

    const sizes = {
      sm: 'h-9 text-sm',
      md: 'h-11 text-base',
      lg: 'h-13 text-lg',
    };

    const paddingWithIcon = Icon ? 'pl-10' : '';
    const paddingWithClear = clearable && props.value ? 'pr-10' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Icon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            className={clsx(
              baseStyles,
              variants[variant],
              sizes[inputSize],
              variant !== 'ghost' && 'rounded-lg px-4',
              paddingWithIcon,
              paddingWithClear,
              error && 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20',
              className
            )}
            {...props}
          />

          {clearable && props.value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {helper && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input Component
export const SearchInput: React.FC<InputProps> = (props) => (
  <Input icon={Search} clearable variant="glass" {...props} />
);

export default Input;