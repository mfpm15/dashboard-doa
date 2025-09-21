'use client';

import React, { useState, useEffect } from 'react';
import { Toast } from '@/types';
import { Icon } from './Icon';

let toastId = 0;
const toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

export function showToast(toast: Omit<Toast, 'id'>) {
  const newToast: Toast = {
    ...toast,
    id: `toast-${++toastId}`
  };

  toasts.push(newToast);
  listeners.forEach(listener => listener([...toasts]));

  // Auto dismiss after 4 seconds
  setTimeout(() => {
    removeToast(newToast.id);
  }, 4000);

  return newToast.id;
}

export function removeToast(id: string) {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach(listener => listener([...toasts]));
  }
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return 'check';
      case 'error': return 'alert';
      case 'warning': return 'alert';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'info': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      default: return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className={`
      max-w-sm p-4 rounded-lg border shadow-lg transition-all duration-200
      ${getColorClasses()}
    `}>
      <div className="flex items-start gap-3">
        <Icon name={getIcon()} className="mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={() => {
                toast.action!.onClick();
                removeToast(toast.id);
              }}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <Icon name="x" size={14} />
        </button>
      </div>
    </div>
  );
}

// Utility functions for easier toast usage
export const toast = {
  success: (message: string, action?: Toast['action']) =>
    showToast({ type: 'success', message, action }),

  error: (message: string, action?: Toast['action']) =>
    showToast({ type: 'error', message, action }),

  warning: (message: string, action?: Toast['action']) =>
    showToast({ type: 'warning', message, action }),

  info: (message: string, action?: Toast['action']) =>
    showToast({ type: 'info', message, action })
};