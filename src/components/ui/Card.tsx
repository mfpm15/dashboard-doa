'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  rounded = '2xl',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'bg-white dark:bg-gray-900 transition-all duration-300';

  const variants = {
    default: 'shadow-sm border border-gray-200 dark:border-gray-800',
    elevated: 'shadow-lg hover:shadow-xl',
    outlined: 'border-2 border-gray-200 dark:border-gray-700',
  };

  const paddings = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  return (
    <div
      className={clsx(baseStyles, variants[variant], paddings[padding], roundedStyles[rounded], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div
    className={clsx('px-5 sm:px-7 py-5 border-b border-gray-100 dark:border-gray-800', className)}
    {...props}
  >
    {children}
  </div>
);

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={clsx('p-5 sm:p-7', className)} {...props}>
    {children}
  </div>
);

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div
    className={clsx(
      'px-5 sm:px-7 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;
