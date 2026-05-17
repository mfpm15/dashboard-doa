'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Locale, AVAILABLE_LOCALES } from '@/lib/i18n';

interface LanguageSelectorProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function LanguageSelector({ locale, onLocaleChange }: LanguageSelectorProps) {
  return (
    <div className="relative inline-flex items-center gap-1.5">
      <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <select
        value={locale}
        onChange={(e) => onLocaleChange(e.target.value as Locale)}
        className="appearance-none bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer pr-5 py-1 border-none focus:outline-none focus:ring-0"
        aria-label="Select language"
      >
        {AVAILABLE_LOCALES.map((l) => (
          <option key={l.value} value={l.value}>
            {l.nativeLabel}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
