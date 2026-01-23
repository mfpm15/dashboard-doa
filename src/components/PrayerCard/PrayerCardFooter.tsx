'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Volume2, Share2 } from 'lucide-react';
import type { PrayerCardFooterProps } from './types';

const PrayerCardFooter: React.FC<PrayerCardFooterProps> = ({
  item,
  isExpanded,
  copied,
  onToggleExpand,
  onCopy,
  onShare,
}) => {
  const hasAudio = item.audio && item.audio.length > 0;
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <div className="px-5 sm:px-7 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Tutup Detail
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Baca Selengkapnya
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          {hasAudio && (
            <button
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Putar audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {canShare && (
            <button
              onClick={onShare}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Bagikan"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onCopy}
            className={`flex items-center gap-2 px-3 py-1.5 ml-1 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={copied ? 'Tersalin' : 'Salin teks'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrayerCardFooter);
