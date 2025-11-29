'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onClick?: () => void;
  delay?: number;
  animate?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    className,
    variant = 'default',
    hover = false,
    padding = 'md',
    rounded = 'xl',
    onClick,
    delay = 0,
    animate = true,
  }, ref) => {
    const baseStyles = 'relative overflow-hidden transition-all duration-300';

    const variants = {
      default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg',
      glass: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-xl',
      gradient: 'bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-gray-900/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-2xl',
      elevated: 'bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/5',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
      xl: 'p-9',
    };

    const roundedStyles = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
    };

    const hoverStyles = hover
      ? 'hover:shadow-2xl hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white hover:to-gray-50 dark:hover:from-gray-900 dark:hover:to-gray-800 cursor-pointer'
      : '';

    const animationVariants = {
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          delay: delay,
          ease: 'easeOut' as const,
        },
      },
    };

    const CardContent = (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          paddings[padding],
          roundedStyles[rounded],
          hoverStyles,
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        {/* Gradient overlay for glass effect */}
        {(variant === 'glass' || variant === 'gradient') && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 dark:from-white/5 dark:via-transparent dark:to-white/2 pointer-events-none" />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Animated gradient border */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none">
            <div className="absolute inset-[-2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-20 blur-xl animate-pulse" />
          </div>
        )}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={animationVariants}
        >
          {CardContent}
        </motion.div>
      );
    }

    return CardContent;
  }
);

Card.displayName = 'Card';

// Card Header Component
export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}> = ({ children, className, border = false }) => (
  <div
    className={clsx(
      'px-6 py-4',
      border && 'border-b border-gray-200 dark:border-gray-800',
      className
    )}
  >
    {children}
  </div>
);

// Card Body Component
export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={clsx('px-6 py-4', className)}>{children}</div>
);

// Card Footer Component
export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}> = ({ children, className, border = false }) => (
  <div
    className={clsx(
      'px-6 py-4',
      border && 'border-t border-gray-200 dark:border-gray-800',
      className
    )}
  >
    {children}
  </div>
);

export default Card;