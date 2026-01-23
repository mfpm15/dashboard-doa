'use client';

import React from 'react';
import type { PrayerCardArabicProps } from './types';

const MAX_PREVIEW_LINES = 2;
const MAX_PREVIEW_CHARS = 150; // Limit characters for very long single lines

const PrayerCardArabic: React.FC<PrayerCardArabicProps> = ({ arabic, fontSize, isExpanded }) => {
  if (!arabic) return null;

  const lines = arabic.split('\n').filter(line => line.trim());
  const hasMoreContent = lines.length > MAX_PREVIEW_LINES || arabic.length > MAX_PREVIEW_CHARS;

  // Get preview text - limit to 2 lines and truncate if needed
  const getPreviewLines = () => {
    const previewLines = lines.slice(0, MAX_PREVIEW_LINES);
    return previewLines.map((line, idx) => {
      // Truncate very long lines
      if (line.length > MAX_PREVIEW_CHARS && idx === 0) {
        return line.substring(0, MAX_PREVIEW_CHARS) + '...';
      }
      return line;
    });
  };

  return (
    <div className="mb-4 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
      <div
        className="w-full"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: '3.2',
          fontFamily: 'var(--font-amiri), "Traditional Arabic", "Noto Naskh Arabic", serif',
          direction: 'rtl',
          textAlign: 'right',
          wordSpacing: '0.25em',
          unicodeBidi: 'embed',
        }}
      >
        <div className="text-slate-800 dark:text-slate-100 font-arabic">
          {isExpanded ? (
            // Full text when expanded
            lines.map((line, idx) => (
              <div key={idx} className="mb-6 last:mb-0 leading-[3.2] tracking-normal">
                {line}
              </div>
            ))
          ) : (
            // Compact preview - max 2 lines
            <div className="relative">
              {getPreviewLines().map((line, idx) => (
                <div key={idx} className="mb-2 last:mb-0 leading-[3.2]">
                  {line}
                </div>
              ))}
              {hasMoreContent && (
                <div className="text-slate-400 dark:text-slate-500 text-sm mt-3 flex justify-center items-center gap-2">
                  <span className="w-6 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                  <span className="text-xs font-sans">...</span>
                  <span className="w-6 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrayerCardArabic);
