'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import type { PrayerCardContentProps } from './types';

const PrayerCardContent: React.FC<PrayerCardContentProps> = ({
  item,
  showLatin,
  showTranslation,
  showSource,
  renderFormattedText,
}) => {
  return (
    <div className="space-y-8 mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Latin Transliteration */}
      {showLatin && item.latin && (
        <div className="relative pl-5 border-l-4 border-blue-400/70 dark:border-blue-500/50">
          <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
            Cara Baca (Latin)
          </h4>
          <div className="text-slate-600 dark:text-slate-300 italic text-base sm:text-lg leading-loose">
            {renderFormattedText(item.latin)}
          </div>
        </div>
      )}

      {/* Indonesian Translation */}
      {showTranslation && item.translation_id && (
        <div className="relative pl-5 border-l-4 border-emerald-500/70 dark:border-emerald-500/50">
          <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
            Artinya
          </h4>
          <div className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-loose">
            {renderFormattedText(item.translation_id)}
          </div>
        </div>
      )}

      {/* Source */}
      {showSource && item.source && (
        <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-700/50 mt-6">
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium text-gray-500 dark:text-gray-400">Sumber:</span>{' '}
            {item.source}
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrayerCardContent);
