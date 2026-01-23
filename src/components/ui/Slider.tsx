'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
  marks?: { value: number; label: string }[];
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      showValue = true,
      valueFormat = (v) => `${v}px`,
      marks,
      className,
      min = 0,
      max = 100,
      value,
      ...props
    },
    ref
  ) => {
    const currentValue = typeof value === 'number' ? value : Number(value) || 0;

    return (
      <div className={clsx('w-full', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {label && <span>{label}</span>}
            {showValue && (
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg">
                {valueFormat(currentValue)}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          value={value}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          {...props}
        />
        {marks && marks.length > 0 && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {marks.map((mark) => (
              <span key={mark.value}>{mark.label}</span>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
