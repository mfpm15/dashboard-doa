'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { PrayerCardProps } from './types';
import { createHighlightText, createRenderFormattedText } from './utils';
import PrayerCardHeader from './PrayerCardHeader';
import PrayerCardArabic from './PrayerCardArabic';
import PrayerCardContent from './PrayerCardContent';
import PrayerCardFooter from './PrayerCardFooter';

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
  const isFirstRender = useRef(true);

  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;

  // Memoize highlight and render functions
  const highlightText = useMemo(() => createHighlightText(searchTerm), [searchTerm]);
  const renderFormattedText = useMemo(
    () => createRenderFormattedText(highlightText),
    [highlightText]
  );

  // Scroll into view when expanded
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isExpanded && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [isExpanded]);

  const handleToggleExpand = useCallback(() => {
    if (onToggleExpand) {
      onToggleExpand(item.id);
    } else {
      setInternalIsExpanded((prev) => !prev);
    }
  }, [onToggleExpand, item.id]);

  const handleCopy = useCallback(async () => {
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
      .filter((line) => line !== null && line !== undefined)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API support
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy:', fallbackErr);
      }
    }
  }, [item, showLatin, showTranslation, showSource]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title}\n\n${item.arabic}`,
        });
      } catch {
        // Share cancelled by user
      }
    }
  }, [item.title, item.arabic]);

  return (
    <div
      ref={cardRef}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-md"
    >
      {/* Header */}
      <PrayerCardHeader
        item={item}
        index={index}
        searchTerm={searchTerm}
        onToggleFavorite={onToggleFavorite}
        highlightText={highlightText}
      />

      {/* Kaidah Section - Only show when expanded */}
      {isExpanded && item.kaidah && (
        <div className="mx-5 sm:mx-7 mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 bg-amber-50/40 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-3">
            <span className="text-amber-500 text-lg">💡</span>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {item.kaidah}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={isExpanded ? "p-5 sm:p-7" : "p-4 sm:p-5"}>
        {/* Arabic Text */}
        <PrayerCardArabic arabic={item.arabic} fontSize={arabicFontSize} isExpanded={isExpanded} />

        {/* Expanded Content */}
        {isExpanded && (
          <PrayerCardContent
            item={item}
            showLatin={showLatin}
            showTranslation={showTranslation}
            showSource={showSource}
            renderFormattedText={renderFormattedText}
          />
        )}
      </div>

      {/* Footer Actions */}
      <PrayerCardFooter
        item={item}
        isExpanded={isExpanded}
        copied={copied}
        showLatin={showLatin}
        showTranslation={showTranslation}
        showSource={showSource}
        onToggleExpand={handleToggleExpand}
        onCopy={handleCopy}
        onShare={handleShare}
      />
    </div>
  );
};

export default React.memo(PrayerCard);
