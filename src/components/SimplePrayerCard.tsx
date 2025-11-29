'use client';

import React, { useState } from 'react';
import { Heart, Copy, ChevronDown, ChevronUp, Check } from 'lucide-react';
import type { Item } from '@/types';

interface SimplePrayerCardProps {
  item: Item;
  searchTerm?: string;
  showLatin?: boolean;
  showTranslation?: boolean;
  showSource?: boolean;
  arabicFontSize?: number;
  onToggleFavorite?: (id: string) => void;
  index: number;
}

const SimplePrayerCard: React.FC<SimplePrayerCardProps> = ({
  item,
  searchTerm = '',
  showLatin = true,
  showTranslation = true,
  showSource = true,
  arabicFontSize = 28,
  onToggleFavorite,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = [
      item.title,
      item.arabic,
      showLatin && item.latin,
      showTranslation && item.translation_id,
      showSource && item.source && `Sumber: ${item.source}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5">{part}</mark>
      ) : part
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {index}. {highlightText(item.title)}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded">
                {item.category}
              </span>
              {item.tags?.slice(0, 2).map((tag) => (
                <span key={tag} className="text-gray-500 dark:text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onToggleFavorite?.(item.id)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`w-5 h-5 ${
                item.favorite
                  ? 'text-red-500 fill-current'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Arabic Text - Always visible */}
        {item.arabic && (
          <div
            className="text-gray-900 dark:text-gray-100 text-center mb-4 leading-loose"
            style={{
              fontSize: `${arabicFontSize}px`,
              fontFamily: 'var(--font-amiri)',
              direction: 'rtl',
            }}
          >
            {isExpanded ? (
              item.arabic.split('\n').map((line, idx) => (
                <div key={idx} className="mb-2">
                  {line}
                </div>
              ))
            ) : (
              <div className="line-clamp-2">
                {item.arabic}
              </div>
            )}
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-3">
            {/* Kaidah */}
            {item.kaidah && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 {item.kaidah}
                </p>
              </div>
            )}

            {/* Latin */}
            {showLatin && item.latin && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-sm text-blue-900 dark:text-blue-200 italic">
                  {highlightText(item.latin)}
                </p>
              </div>
            )}

            {/* Translation */}
            {showTranslation && item.translation_id && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-sm text-green-900 dark:text-green-200">
                  {highlightText(item.translation_id)}
                </p>
              </div>
            )}

            {/* Source */}
            {showSource && item.source && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                Sumber: {item.source}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Tutup
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Baca Lengkap
            </>
          )}
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l border-gray-200 dark:border-gray-700 flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Tersalin
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Salin
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SimplePrayerCard;