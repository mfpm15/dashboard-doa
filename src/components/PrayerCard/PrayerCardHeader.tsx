'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import type { PrayerCardHeaderProps } from './types';

const PrayerCardHeader: React.FC<PrayerCardHeaderProps> = ({
  item,
  index,
  onToggleFavorite,
  highlightText,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 px-5 sm:px-7 py-5 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-100 dark:border-emerald-800">
            {index}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
              {highlightText(item.title)}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full border border-slate-200 dark:border-slate-700">
                {item.category}
              </span>
              {item.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs text-gray-400 dark:text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite?.(item.id)}
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label={item.favorite ? 'Hapus dari favorit' : 'Tambahkan ke favorit'}
            aria-pressed={item.favorite}
          >
            <Heart
              className={`w-5 h-5 ${
                item.favorite
                  ? 'text-red-500 fill-current'
                  : 'text-gray-300 dark:text-gray-600 hover:text-red-400'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrayerCardHeader);
