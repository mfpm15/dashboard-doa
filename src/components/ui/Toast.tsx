'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-color)',
          border: 'var(--toast-border)',
        },
        className: 'toast-custom',
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white/90 dark:group-[.toaster]:bg-gray-900/90 backdrop-blur-md group-[.toaster]:text-gray-950 dark:group-[.toaster]:text-gray-50 group-[.toaster]:border-gray-200 dark:group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400',
          actionButton: 'group-[.toast]:bg-emerald-500 group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-gray-100 dark:group-[.toast]:bg-gray-800 group-[.toast]:text-gray-700 dark:group-[.toast]:text-gray-300',
          closeButton: 'group-[.toast]:bg-transparent group-[.toast]:border-gray-300 dark:group-[.toast]:border-gray-700 hover:group-[.toast]:bg-gray-100 dark:hover:group-[.toast]:bg-gray-800',
          success: 'group-[.toaster]:bg-green-50/90 dark:group-[.toaster]:bg-green-900/20 group-[.toaster]:text-green-800 dark:group-[.toaster]:text-green-200 group-[.toaster]:border-green-200 dark:group-[.toaster]:border-green-800',
          error: 'group-[.toaster]:bg-red-50/90 dark:group-[.toaster]:bg-red-900/20 group-[.toaster]:text-red-800 dark:group-[.toaster]:text-red-200 group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-800',
          warning: 'group-[.toaster]:bg-amber-50/90 dark:group-[.toaster]:bg-amber-900/20 group-[.toaster]:text-amber-800 dark:group-[.toaster]:text-amber-200 group-[.toaster]:border-amber-200 dark:group-[.toaster]:border-amber-800',
          info: 'group-[.toaster]:bg-blue-50/90 dark:group-[.toaster]:bg-blue-900/20 group-[.toaster]:text-blue-800 dark:group-[.toaster]:text-blue-200 group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-800',
        },
      }}
      expand={false}
      richColors
      closeButton
    />
  );
}

export { toast } from 'sonner';