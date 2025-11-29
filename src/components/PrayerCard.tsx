'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Copy, ChevronDown, ChevronUp, Check, BookOpen, Volume2, Share2 } from 'lucide-react';
import type { Item } from '@/types';

interface PrayerCardProps {
  item: Item;
  searchTerm?: string;
  showLatin?: boolean;
  showTranslation?: boolean;
  showSource?: boolean;
  arabicFontSize?: number;
  onToggleFavorite?: (id: string) => void;
  index: number;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({
  item,
  searchTerm = '',
  showLatin = true,
  showTranslation = true,
  showSource = true,
  arabicFontSize = 32,
  onToggleFavorite,
  index,
  isExpanded: externalIsExpanded,
  onToggleExpand,
}) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;

  useEffect(() => {
    if (isExpanded && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [isExpanded]);

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand(item.id);
    } else {
      setInternalIsExpanded(!internalIsExpanded);
    }
  };

  const handleCopy = async () => {
    const textToCopy = [
      item.title,
      '',
      item.arabic,
      '',
      showLatin && item.latin ? `Latin: ${item.latin}` : '',
      '',
      showTranslation && item.translation_id ? `Artinya: ${item.translation_id}` : '',
      '',
      showSource && item.source ? `Sumber: ${item.source}` : '',
    ]
      .filter(line => line !== null && line !== undefined)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title}\n\n${item.arabic}`,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const highlightText = (text: string) => {
    if (!searchTerm || !text) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">{part}</mark>
      ) : part
    );
  };

  // Render formatted text for Latin/Translation (with markdown support)
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    const processInlineMarkdown = (str: string) => {
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;

      // Combined regex to capture both bold (**text**) and italic (*text*) patterns
      const regex = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
      let match;

      while ((match = regex.exec(str)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          const beforeText = str.substring(lastIndex, match.index);
          elements.push(<span key={`text-${lastIndex}`}>{highlightText(beforeText)}</span>);
        }

        // Add the formatted text
        if (match[1]) {
          // Bold text (captured by first group)
          elements.push(
            <strong key={`bold-${match.index}`} className="font-bold text-slate-900 dark:text-slate-100">
              {match[1]}
            </strong>
          );
        } else if (match[2]) {
          // Italic text (captured by second group)
          elements.push(
            <em key={`italic-${match.index}`} className="font-medium italic text-slate-800 dark:text-slate-200">
              {match[2]}
            </em>
          );
        }

        lastIndex = match.index + match[0].length;
      }

      // Add any remaining text
      if (lastIndex < str.length) {
        const remainingText = str.substring(lastIndex);
        elements.push(<span key={`text-${lastIndex}`}>{highlightText(remainingText)}</span>);
      }

      return elements.length > 0 ? elements : highlightText(str);
    };

    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      const trimmed = line.trim();

      // Check for headings
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={lineIndex} className="text-lg font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={lineIndex} className="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
            {trimmed.replace(/^##\s*/, '')}
          </h3>
        );
      }
      if (trimmed === '---') {
        return <hr key={lineIndex} className="my-8 border-t border-gray-200 dark:border-gray-700" />;
      }

      // Check for bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        return (
          <div key={lineIndex} className="flex items-start gap-3 mb-2 pl-2">
            <span className="text-emerald-500 mt-1.5 text-lg">•</span>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
              {processInlineMarkdown(content)}
            </div>
          </div>
        );
      }

      // Detect Arabic line (heuristic: > 40% Arabic characters)
      const arabicPattern = /[\u0600-\u06FF]/;
      if (arabicPattern.test(trimmed)) {
        const arabicChars = (trimmed.match(/[\u0600-\u06FF]/g) || []).length;
        const totalChars = trimmed.replace(/\s/g, '').length;
        
        if (totalChars > 0 && (arabicChars / totalChars) > 0.4) {
          return (
            <div key={lineIndex} className="my-6 px-4 py-2 rounded-lg border-r-4 border-emerald-400 bg-gray-50/50 dark:bg-gray-800/50" dir="rtl">
              <p className="font-arabic text-2xl sm:text-3xl text-slate-800 dark:text-slate-200 leading-loose text-right">
                {trimmed}
              </p>
            </div>
          );
        }
      }

      const processedContent = processInlineMarkdown(line);

      return (
        <div key={lineIndex} className={trimmed ? 'mb-3 leading-relaxed text-gray-700 dark:text-gray-300' : 'mb-3'}>
          {processedContent}
        </div>
      );
    });
  };

  return (
    <div ref={cardRef} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 mb-6 transition-all duration-300 hover:shadow-md">
      {/* Header */}
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
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Favorite"
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

      {/* Kaidah Section */}
      {item.kaidah && (
        <div className="mx-5 sm:mx-7 mt-5">
          <div className="p-4 bg-amber-50/40 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-3">
            <span className="text-amber-500 text-lg">💡</span>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {item.kaidah}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-5 sm:p-7">
        {/* Arabic Text - ALWAYS VISIBLE with proper RTL */}
        {item.arabic && (
          <div className="mb-6 p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <div
              className="text-center"
              style={{
                fontSize: `${arabicFontSize}px`,
                lineHeight: 2.2,
                fontFamily: 'var(--font-amiri), "Traditional Arabic", "Noto Naskh Arabic", serif',
                direction: 'rtl',
                unicodeBidi: 'embed',
              }}
            >
              <div className="text-slate-800 dark:text-slate-100 font-arabic">
                {isExpanded ? (
                  // Full text when expanded
                  item.arabic.split('\n').map((line, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                      {line}
                    </div>
                  ))
                ) : (
                  // Preview - first 3 lines
                  <div>
                    {item.arabic.split('\n').slice(0, 3).map((line, idx) => (
                      <div key={idx} className="mb-3 last:mb-0">
                        {line}
                      </div>
                    ))}
                    {item.arabic.split('\n').length > 3 && (
                      <div className="text-slate-400 dark:text-slate-500 text-base mt-4 flex justify-center">
                        <span className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
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
                  <span className="font-medium text-gray-500 dark:text-gray-400">Sumber:</span> {item.source}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 sm:px-7 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button
            onClick={handleToggleExpand}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full transition-all"
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
            {item.audio && item.audio.length > 0 && (
              <button
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Play audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-1.5 ml-1 text-sm font-medium rounded-full transition-colors ${ 
                copied
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
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
    </div>
  );
};

export default React.memo(PrayerCard);
