'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Search, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search';
  error?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onClear?: () => void;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      error = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onClear,
      fullWidth = true,
      className,
      ...props
    },
    ref
  ) => {
    const isSearch = variant === 'search';
    const IconLeft = isSearch ? Search : LeftIcon;
    const hasValue = props.value && String(props.value).length > 0;

    const baseStyles =
      'bg-white dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium';

    const sizeStyles = 'px-4 py-3 text-base';

    const errorStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-700';

    return (
      <div className={clsx('relative', fullWidth && 'w-full')}>
        {IconLeft && (
          <IconLeft className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
        <input
          ref={ref}
          className={clsx(
            baseStyles,
            sizeStyles,
            errorStyles,
            fullWidth && 'w-full',
            IconLeft && 'pl-12',
            (RightIcon || (onClear && hasValue)) && 'pr-12',
            className
          )}
          {...props}
        />
        {onClear && hasValue ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
            aria-label="Clear input"
          >
            <X className="w-5 h-5" />
          </button>
        ) : RightIcon ? (
          <RightIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
