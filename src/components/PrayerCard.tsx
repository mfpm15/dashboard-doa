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
            <strong key={`bold-${match.index}`} className="font-bold text-gray-900 dark:text-white">
              {match[1]}
            </strong>
          );
        } else if (match[2]) {
          // Italic text (captured by second group)
          elements.push(
            <em key={`italic-${match.index}`} className="font-medium italic text-gray-800 dark:text-gray-200">
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
          <h4 key={lineIndex} className="text-xl font-bold mt-6 mb-3 text-emerald-800 dark:text-emerald-400 border-b border-emerald-200 dark:border-emerald-800 pb-2">
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={lineIndex} className="text-2xl font-bold mt-8 mb-4 text-emerald-900 dark:text-emerald-300">
            {trimmed.replace(/^##\s*/, '')}
          </h3>
        );
      }
      if (trimmed === '---') {
        return <hr key={lineIndex} className="my-8 border-t-2 border-gray-100 dark:border-gray-700" />;
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
            <div key={lineIndex} className="my-4 px-2 py-1 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10" dir="rtl">
              <p className="font-arabic text-2xl sm:text-3xl text-emerald-900 dark:text-emerald-100 leading-loose text-right">
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
    <div ref={cardRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm">
              {index}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {highlightText(item.title)}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-full">
                  {item.category}
                </span>
                {item.tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-gray-500 dark:text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite?.(item.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Favorite"
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
      </div>

      {/* Kaidah Section */}
      {item.kaidah && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
          <p className="text-base sm:text-lg text-amber-900 dark:text-amber-200 font-medium">
            💡 Kaidah: {item.kaidah}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        {/* Arabic Text - ALWAYS VISIBLE with proper RTL */}
        {item.arabic && (
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
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
              <div className="text-gray-900 dark:text-gray-100 font-arabic">
                {isExpanded ? (
                  // Full text when expanded
                  item.arabic.split('\n').map((line, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      {line}
                    </div>
                  ))
                ) : (
                  // Preview - first 3 lines
                  <div>
                    {item.arabic.split('\n').slice(0, 3).map((line, idx) => (
                      <div key={idx} className="mb-2">
                        {line}
                      </div>
                    ))}
                    {item.arabic.split('\n').length > 3 && (
                      <div className="text-gray-400 dark:text-gray-500 text-base mt-2">
                        ...
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
          <div className="space-y-4 mt-6">
            {/* Latin Transliteration */}
            {showLatin && item.latin && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-3">
                  Cara Baca (Latin)
                </h4>
                <div className="text-gray-700 dark:text-gray-300 italic text-base sm:text-lg leading-relaxed">
                  {renderFormattedText(item.latin)}
                </div>
              </div>
            )}

            {/* Indonesian Translation */}
            {showTranslation && item.translation_id && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="text-sm font-bold uppercase tracking-wider text-green-900 dark:text-green-300 mb-3">
                  Artinya
                </h4>
                <div className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                  {renderFormattedText(item.translation_id)}
                </div>
              </div>
            )}

            {/* Source */}
            {showSource && item.source && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Sumber: {item.source}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button
            onClick={handleToggleExpand}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Tutup
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Baca Selengkapnya
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {item.audio && item.audio.length > 0 && (
              <button
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Play audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg ${
                copied
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  Salin
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerCard;