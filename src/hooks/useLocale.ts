'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Locale,
  Translations,
  getLocale,
  setLocale as saveLocale,
  getTranslations,
  getDirection,
  AVAILABLE_LOCALES,
} from '@/lib/i18n';

export interface UseLocaleReturn {
  locale: Locale;
  t: Translations;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  availableLocales: typeof AVAILABLE_LOCALES;
}

export function useLocale(): UseLocaleReturn {
  const [locale, setLocaleState] = useState<Locale>('id');
  const [t, setT] = useState<Translations>(getTranslations('id'));
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const savedLocale = getLocale();
    setLocaleState(savedLocale);
    setT(getTranslations(savedLocale));
    setDir(getDirection(savedLocale));
  }, []);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    saveLocale(newLocale);
    setLocaleState(newLocale);
    setT(getTranslations(newLocale));
    setDir(getDirection(newLocale));

    // Update document direction for RTL support
    if (typeof document !== 'undefined') {
      document.documentElement.dir = getDirection(newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  return {
    locale,
    t,
    dir,
    setLocale: handleSetLocale,
    availableLocales: AVAILABLE_LOCALES,
  };
}
