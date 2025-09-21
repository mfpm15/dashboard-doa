'use client';

import { useState, useEffect } from 'react';
import { Icon } from './ui/Icon';
import { Item } from '@/types';

interface ReadingModeProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReadingMode({ item, isOpen, onClose }: ReadingModeProps) {
  const [fontSize, setFontSize] = useState(18);
  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [arabicLineHeight, setArabicLineHeight] = useState(1.8);
  const [serifFont, setSerifFont] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    // Load reading preferences
    const prefs = JSON.parse(localStorage.getItem('reading-preferences') || '{}');
    setFontSize(prefs.fontSize || 18);
    setArabicFontSize(prefs.arabicFontSize || 24);
    setLineHeight(prefs.lineHeight || 1.6);
    setArabicLineHeight(prefs.arabicLineHeight || 1.8);
    setSerifFont(prefs.serifFont || false);
  }, []);

  useEffect(() => {
    // Save reading preferences
    const prefs = {
      fontSize,
      arabicFontSize,
      lineHeight,
      arabicLineHeight,
      serifFont
    };
    localStorage.setItem('reading-preferences', JSON.stringify(prefs));
  }, [fontSize, arabicFontSize, lineHeight, arabicLineHeight, serifFont]);

  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [fullscreen]);

  if (!isOpen || !item) return null;

  const fontFamily = serifFont
    ? '"Amiri", "Times New Roman", serif'
    : '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

  const arabicFontFamily = '"Noto Naskh Arabic", "Amiri", "Times New Roman", serif';

  return (
    <div className={`
      fixed inset-0 z-50 bg-white dark:bg-gray-900
      ${fullscreen ? 'p-0' : 'p-4 md:p-8'}
      transition-all duration-300
    `}>
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon name="x" className="w-4 h-4" />
            <span className="hidden sm:inline">Tutup</span>
          </button>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon name={fullscreen ? "monitor" : "external-link"} className="w-4 h-4" />
            <span className="hidden sm:inline">
              {fullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
            </span>
          </button>
        </div>

        {/* Reading Controls */}
        <div className="flex items-center gap-2">
          {/* Font Size */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 1))}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Icon name="chevron-down" className="w-3 h-3" />
            </button>
            <span className="text-sm font-medium min-w-[3ch] text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Icon name="plus" className="w-3 h-3" />
            </button>
          </div>

          {/* Serif Toggle */}
          <button
            onClick={() => setSerifFont(!serifFont)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              serifFont
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Aa
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`
        max-w-4xl mx-auto h-full overflow-y-auto
        ${fullscreen ? 'px-8 py-4' : 'px-4'}
      `}>
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {/* Title */}
          <h1
            className="text-2xl md:text-3xl font-bold mb-6 leading-tight"
            style={{
              fontFamily,
              fontSize: `${fontSize + 6}px`,
              lineHeight: lineHeight
            }}
          >
            {item.title}
          </h1>

          {/* Arabic Text */}
          {item.arabic && (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div
                className="text-right leading-loose"
                style={{
                  fontFamily: arabicFontFamily,
                  fontSize: `${arabicFontSize}px`,
                  lineHeight: arabicLineHeight,
                  direction: 'rtl'
                }}
              >
                {item.arabic}
              </div>
            </div>
          )}

          {/* Latin Transliteration */}
          {item.latin && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Transliterasi
              </h3>
              <div
                className="italic text-gray-800 dark:text-gray-200"
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight
                }}
              >
                {item.latin}
              </div>
            </div>
          )}

          {/* Indonesian Translation */}
          {item.translation_id && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Terjemahan
              </h3>
              <div
                className="text-gray-800 dark:text-gray-200"
                style={{
                  fontFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight
                }}
              >
                {item.translation_id}
              </div>
            </div>
          )}

          {/* Source */}
          {item.source && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Sumber: {item.source}
              </p>
            </div>
          )}

          {/* Category & Tags */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full">
              {item.category}
            </span>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </div>

      {/* Arabic Font Size Control (Floating) */}
      <div className="fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Font Arab</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setArabicFontSize(Math.max(18, arabicFontSize - 2))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Icon name="chevron-down" className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium min-w-[3ch] text-center">{arabicFontSize}</span>
          <button
            onClick={() => setArabicFontSize(Math.min(36, arabicFontSize + 2))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Icon name="plus" className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}