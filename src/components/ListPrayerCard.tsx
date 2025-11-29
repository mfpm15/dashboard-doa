'use client';

import React, { useState } from 'react';
import { Heart, Copy, ChevronDown, ChevronUp, Check, BookOpen, Hash } from 'lucide-react';
import type { Item } from '@/types';

interface ListPrayerCardProps {
  item: Item;
  searchTerm?: string;
  showLatin?: boolean;
  showTranslation?: boolean;
  showSource?: boolean;
  arabicFontSize?: number;
  onToggleFavorite?: (id: string) => void;
  index: number;
}

const ListPrayerCard: React.FC<ListPrayerCardProps> = ({
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
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">{part}</mark>
      ) : part
    );
  };

  // Enhanced function to render markdown-style formatting
  const renderFormattedText = (text: string) => {
    // Split by lines first to handle line breaks and special formatting
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      // Check for headings (###, ##, #)
      if (line.trim().startsWith('###')) {
        const content = line.replace(/^###\s*/, '');
        return (
          <div key={lineIndex} className="mt-4 mb-2">
            <h4 className="text-base font-bold text-gray-900 dark:text-white">{content}</h4>
          </div>
        );
      } else if (line.trim().startsWith('##')) {
        const content = line.replace(/^##\s*/, '');
        return (
          <div key={lineIndex} className="mt-4 mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{content}</h3>
          </div>
        );
      } else if (line.trim().startsWith('#')) {
        const content = line.replace(/^#\s*/, '');
        return (
          <div key={lineIndex} className="mt-4 mb-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{content}</h2>
          </div>
        );
      }

      // Check for horizontal rule (---)
      if (line.trim() === '---') {
        return <hr key={lineIndex} className="my-4 border-t border-gray-300 dark:border-gray-600" />;
      }

      // Handle bold text with ** or *
      const renderBoldText = (text: string) => {
        // More comprehensive regex to handle bold text
        const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*[^*\s]\*|\*[^*\s]\*)/g);

        return parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Double asterisk - extra bold
            const content = part.slice(2, -2);
            return <strong key={partIndex} className="font-bold text-gray-900 dark:text-gray-100">{content}</strong>;
          } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            // Single asterisk - semi-bold (but not double asterisk)
            const content = part.slice(1, -1);
            return <strong key={partIndex} className="font-semibold text-gray-800 dark:text-gray-200">{content}</strong>;
          }
          // Regular text - check for search highlighting
          return <span key={partIndex}>{highlightText(part)}</span>;
        });
      };

      // Return formatted line
      if (line.trim()) {
        return (
          <div key={lineIndex} className="mb-2">
            {renderBoldText(line)}
          </div>
        );
      } else {
        // Empty line - add spacing
        return <div key={lineIndex} className="mb-2" />;
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
      {/* Header Row */}
      <div className="p-5 pb-0">
        <div className="flex items-start gap-4">
          {/* Number Badge */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {index}
              </span>
            </div>
          </div>

          {/* Title and Meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight mb-2">
                  {highlightText(item.title)}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-md">
                    <BookOpen className="w-3 h-3" />
                    {item.category}
                  </span>
                  {item.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Hash className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => onToggleFavorite?.(item.id)}
                className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    item.favorite
                      ? 'text-red-500 fill-current'
                      : 'text-gray-400 dark:text-gray-500 hover:text-red-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Kaidah - Always visible if exists */}
        {item.kaidah && (
          <div className="mt-4 ml-14 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              💡 <span className="font-medium">Kaidah:</span> {item.kaidah}
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-5 pt-4">
        <div className="ml-14">
          {/* Arabic Text */}
          {item.arabic && (
            <div className="mb-4">
              <div
                className="text-gray-900 dark:text-gray-100 leading-loose text-right"
                style={{
                  fontSize: `${arabicFontSize}px`,
                  fontFamily: 'var(--font-amiri)',
                  direction: 'rtl',
                  lineHeight: 2,
                }}
              >
                {isExpanded ? (
                  item.arabic.split('\n').map((line, idx) => (
                    <div key={idx} className="mb-3 last:mb-0">
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="line-clamp-3">
                    {item.arabic}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-4">
              {/* Latin Transliteration */}
              {showLatin && item.latin && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                  <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2 uppercase tracking-wider">
                    Transliterasi Latin
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-200 italic leading-relaxed">
                    {renderFormattedText(item.latin)}
                  </div>
                </div>
              )}

              {/* Translation */}
              {showTranslation && item.translation_id && (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200/50 dark:border-green-800/50">
                  <h4 className="text-xs font-semibold text-green-900 dark:text-green-300 mb-2 uppercase tracking-wider">
                    Terjemahan Indonesia
                  </h4>
                  <div className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                    {renderFormattedText(item.translation_id)}
                  </div>
                </div>
              )}

              {/* Source */}
              {showSource && item.source && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    📚 <span className="font-medium">Sumber:</span> {item.source}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-5 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Tutup Detail
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Lihat Selengkapnya
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Tersalin
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Salin Doa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListPrayerCard;