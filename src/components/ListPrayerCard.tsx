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
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">{part}</mark>
      ) : part
    );
  };

  // Enhanced function to render markdown-style formatting
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        const content = trimmed.replace(/^###\s*/, '');
        return (
          <div key={lineIndex} className="mt-4 mb-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{content}</h4>
          </div>
        );
      } else if (trimmed.startsWith('##')) {
        const content = trimmed.replace(/^##\s*/, '');
        return (
          <div key={lineIndex} className="mt-4 mb-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{content}</h3>
          </div>
        );
      } else if (trimmed === '---') {
        return <hr key={lineIndex} className="my-4 border-t border-gray-200 dark:border-gray-700" />;
      }

      // Check for bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
         const content = trimmed.substring(2);
         return (
           <div key={lineIndex} className="flex items-start gap-2 mb-1 pl-2">
             <span className="text-emerald-500 mt-1 text-xs">•</span>
             <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1">
               {content}
             </div>
           </div>
         );
      }

      const renderBoldText = (text: string) => {
        const parts = text.split(/(\$\$\*[^*]+\*\*|\*[^*\s][^*]*[^*\s]\*|\*[^*\s]\*)/g);
        return parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            return <strong key={partIndex} className="font-bold text-slate-900 dark:text-slate-100">{content}</strong>;
          } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
            const content = part.slice(1, -1);
            return <strong key={partIndex} className="font-semibold text-slate-800 dark:text-slate-200">{content}</strong>;
          }
          return <span key={partIndex}>{highlightText(part)}</span>;
        });
      };

      if (trimmed) {
        return (
          <div key={lineIndex} className="mb-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {renderBoldText(line)}
          </div>
        );
      } else {
        return <div key={lineIndex} className="mb-2" />;
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-800">
      {/* Header Row */}
      <div className="p-4 sm:p-5 pb-0">
        <div className="flex items-start gap-4">
          {/* Number Badge */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
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
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                    <BookOpen className="w-3 h-3" />
                    {item.category}
                  </span>
                  {item.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-gray-400 dark:text-gray-500">
                      <Hash className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => onToggleFavorite?.(item.id)}
                className="flex-shrink-0 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle favorite"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${ 
                    item.favorite
                      ? 'text-red-500 fill-current'
                      : 'text-gray-300 dark:text-gray-600 hover:text-red-400'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Kaidah - Always visible if exists */}
        {item.kaidah && (
          <div className="mt-4 ml-14 p-3 bg-amber-50/40 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30 flex gap-2">
            <span className="text-amber-500">💡</span>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.kaidah}
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5 pt-4">
        <div className="ml-14">
          {/* Arabic Text */}
          {item.arabic && (
            <div className="mb-4">
              <div
                className="text-slate-800 dark:text-slate-100 leading-loose text-right"
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
                  <div className="line-clamp-3 opacity-90">
                    {item.arabic}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Latin Transliteration */}
              {showLatin && item.latin && (
                <div className="pl-4 border-l-4 border-blue-400/50 dark:border-blue-500/30">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">
                    Transliterasi Latin
                  </h4>
                  <div className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    {renderFormattedText(item.latin)}
                  </div>
                </div>
              )}

              {/* Translation */}
              {showTranslation && item.translation_id && (
                <div className="pl-4 border-l-4 border-emerald-500/50 dark:border-emerald-500/30">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wider">
                    Terjemahan Indonesia
                  </h4>
                  <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {renderFormattedText(item.translation_id)}
                  </div>
                </div>
              )}

              {/* Source */}
              {showSource && item.source && (
                <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    📚 <span className="font-medium">Sumber:</span> {item.source}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 px-5 py-3 rounded-b-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full transition-all ${ 
              copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Tersalin
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Salin Doa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ListPrayerCard);
