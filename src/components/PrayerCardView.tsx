'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Item } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface PrayerCardViewProps {
  items: Item[];
  searchTerm: string;
  showLatin: boolean;
  showTranslation: boolean;
  showSource: boolean;
  arabicFontSize: number;
  onMoveItem: (id: string, direction: 'up' | 'down') => void;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Memoized highlight component
const HighlightedText = React.memo(({ text, term }: { text: string | undefined; term: string }) => {
  const content = useMemo(() => {
    if (!text) return null;
    if (!term.trim()) return <span>{text}</span>;

    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    const segments = text.split(regex);

    return (
      <>
        {segments.map((segment, index) =>
          index % 2 === 1 ? (
            <mark key={index} className="bg-emerald-100 text-emerald-900 px-0.5 rounded">
              {segment}
            </mark>
          ) : (
            <span key={index}>{segment}</span>
          )
        )}
      </>
    );
  }, [text, term]);

  return content;
});

HighlightedText.displayName = 'HighlightedText';

// Memoized individual prayer card
const PrayerCard = React.memo(({
  item,
  index,
  itemsLength,
  searchTerm,
  showLatin,
  showTranslation,
  showSource,
  arabicFontSize,
  isExpanded,
  onToggle,
  onMoveUp,
  onMoveDown,
  cardRef
}: {
  item: Item;
  index: number;
  itemsLength: number;
  searchTerm: string;
  showLatin: boolean;
  showTranslation: boolean;
  showSource: boolean;
  arabicFontSize: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  cardRef: (element: HTMLElement | null) => void;
}) => {
  const canMoveUp = index > 0;
  const canMoveDown = index < itemsLength - 1;
  const contentId = `prayer-content-${item.id}`;

  const handleToggle = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle(item.id);
    }
  }, [item.id, onToggle]);

  const handleMoveUp = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onMoveUp(item.id);
  }, [item.id, onMoveUp]);

  const handleMoveDown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onMoveDown(item.id);
  }, [item.id, onMoveDown]);

  const translationParagraphs = useMemo(() => {
    return item.translation_id?.split('\n\n') || [];
  }, [item.translation_id]);

  return (
    <article
      ref={cardRef}
      className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition"
    >
      <div className="absolute inset-x-6 top-0 h-24 bg-gradient-to-b from-emerald-50/60 to-transparent dark:from-emerald-500/10 pointer-events-none" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-2 flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-200/70 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <Icon name="bookmark" size={14} />
              {item.category}
            </span>
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-controls={contentId}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              className="flex w-full items-start justify-between gap-3 rounded-2xl px-2 py-1 text-left transition hover:bg-slate-50/80 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                <HighlightedText text={item.title} term={searchTerm} />
              </h2>
              <div className="flex items-center gap-3">
                {item.favorite && (
                  <span className="inline-flex items-center gap-1 text-amber-500 text-sm font-medium">
                    <Icon name="star" size={14} className="fill-current" />
                    Favorit
                  </span>
                )}
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 dark:border-slate-700">
                  <Icon
                    name="chevron-down"
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {item.kaidah && (
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                  {item.kaidah}
                </p>
              )}
              {!isExpanded && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  <HighlightedText text={item.translation_id || item.arabic || ''} term={searchTerm} />
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              type="button"
              onClick={handleMoveUp}
              disabled={!canMoveUp}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Geser doa ke atas"
            >
              <Icon name="arrow-up" size={18} />
            </button>
            <button
              type="button"
              onClick={handleMoveDown}
              disabled={!canMoveDown}
              className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label="Geser doa ke bawah"
            >
              <Icon name="arrow-down" size={18} />
            </button>
          </div>
        </div>

        <div
          id={contentId}
          className={`mt-6 space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 max-h-[4000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
        >
          {isExpanded && (
            <>
              {item.arabic && (
                <p
                  className="font-arabic text-emerald-900 dark:text-emerald-100 leading-relaxed"
                  style={{ fontSize: arabicFontSize, lineHeight: 1.8 }}
                  lang="ar"
                  dir="rtl"
                >
                  {item.arabic}
                </p>
              )}

              {showLatin && item.latin && (
                <p className="text-base text-slate-600 dark:text-slate-300 italic tracking-wide leading-relaxed whitespace-pre-line break-words">
                  <HighlightedText text={item.latin} term={searchTerm} />
                </p>
              )}

              {showTranslation && item.translation_id && (
                <div className="space-y-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {translationParagraphs.map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line break-words">
                      <HighlightedText text={paragraph} term={searchTerm} />
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <footer className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          {showSource && item.source && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/60">
              <Icon name="book" size={14} />
              {item.source}
            </span>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-500/20"
                >
                  <Icon name="hash" size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.index === nextProps.index &&
    prevProps.itemsLength === nextProps.itemsLength &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.showLatin === nextProps.showLatin &&
    prevProps.showTranslation === nextProps.showTranslation &&
    prevProps.showSource === nextProps.showSource &&
    prevProps.arabicFontSize === nextProps.arabicFontSize &&
    prevProps.isExpanded === nextProps.isExpanded
  );
});

PrayerCard.displayName = 'PrayerCard';

type CardRefs = Record<string, HTMLElement | null>;

export function PrayerCardView({
  items,
  searchTerm,
  showLatin,
  showTranslation,
  showSource,
  arabicFontSize,
  onMoveItem
}: PrayerCardViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cardRefs = useRef<CardRefs>({});

  useEffect(() => {
    setExpandedId(null);
  }, [items]);

  useEffect(() => {
    if (expandedId) {
      const element = cardRefs.current[expandedId];
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [expandedId]);

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  const handleMoveUp = useCallback((id: string) => {
    onMoveItem(id, 'up');
  }, [onMoveItem]);

  const handleMoveDown = useCallback((id: string) => {
    onMoveItem(id, 'down');
  }, [onMoveItem]);

  if (items.length === 0) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center text-center gap-4 py-20">
        <div className="w-16 h-16 rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700 flex items-center justify-center shadow-lg">
          <Icon name="book-open" size={28} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            Doa belum ditemukan
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md">
            Coba ubah kata kunci pencarian atau pilih kategori lain. Seluruh koleksi doa akan tampil kembali
            ketika pencarian dikosongkan.
          </p>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      {items.map((item, index) => (
        <PrayerCard
          key={item.id}
          item={item}
          index={index}
          itemsLength={items.length}
          searchTerm={searchTerm}
          showLatin={showLatin}
          showTranslation={showTranslation}
          showSource={showSource}
          arabicFontSize={arabicFontSize}
          isExpanded={expandedId === item.id}
          onToggle={handleToggle}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          cardRef={(element) => {
            cardRefs.current[item.id] = element;
          }}
        />
      ))}
=======
    <div className="space-y-4 sm:space-y-5">
      {items.map((item, index) => {
        const canMoveUp = index > 0;
        const canMoveDown = index < items.length - 1;
        const isExpanded = expandedId === item.id;
        const contentId = `prayer-content-${item.id}`;

        return (
          <article
            key={item.id}
            ref={element => {
              cardRefs.current[item.id] = element;
            }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/70 dark:border-slate-800 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all"
          >
            <div className="absolute inset-x-6 top-0 h-24 bg-gradient-to-b from-emerald-50/60 to-transparent dark:from-emerald-500/10 pointer-events-none" />

            <div className="relative p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
                <div className="space-y-2 flex-1">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-emerald-200/70 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                    <Icon name="bookmark" size={14} />
                    {item.category}
                  </span>
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-controls={contentId}
                    onClick={() => handleToggle(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleToggle(item.id);
                      }
                    }}
                    className="flex w-full items-start justify-between gap-3 rounded-2xl px-2 py-1 text-left transition hover:bg-slate-50/80 dark:hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-slate-50 break-words">
                      {highlight(item.title, searchTerm)}
                    </h2>
                    <div className="flex items-center gap-3">
                      {item.favorite && (
                        <span className="inline-flex items-center gap-1 text-amber-500 text-sm font-medium">
                          <Icon name="star" size={14} className="fill-current" />
                          Favorit
                        </span>
                      )}
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 dark:border-slate-700 flex-shrink-0">
                        <Icon
                          name="chevron-down"
                          size={18}
                          className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    {item.kaidah && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl line-clamp-2">
                        {item.kaidah}
                      </p>
                    )}
                    {!isExpanded && (
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                        {highlight(
                          (item.translation_id || item.latin || item.arabic || '')
                            .split('\n')
                            .filter(Boolean)
                            .slice(0, 3)
                            .join(' '),
                          searchTerm
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 self-start shrink-0">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onMoveItem(item.id, 'up');
                    }}
                    disabled={!canMoveUp}
                    className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    aria-label={`Geser doa "${item.title}" ke atas`}
                  >
                    <Icon name="arrow-up" size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onMoveItem(item.id, 'down');
                    }}
                    disabled={!canMoveDown}
                    className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    aria-label={`Geser doa "${item.title}" ke bawah`}
                  >
                    <Icon name="arrow-down" size={18} />
                  </button>
                </div>
              </div>

              <div
                id={contentId}
                className={`mt-4 sm:mt-6 space-y-3 sm:space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100 max-h-[4000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}
              >
                {isExpanded && (
                  <>
                    {item.arabic && (
                      <p
                        className="font-arabic text-emerald-900 dark:text-emerald-100 leading-relaxed break-words"
                        style={{ fontSize: arabicFontSize, lineHeight: 1.8 }}
                        lang="ar"
                        dir="rtl"
                      >
                        {item.arabic}
                      </p>
                    )}

                    {/\b\d+x\b/i.test(item.kaidah || '') && (
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200/70 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-200 text-[10px] sm:text-xs">
                        <Icon name="hash" size={12} />
                        <span className="break-words">
                          Dzikir ini memiliki anjuran jumlah bacaan. Gunakan tasbih / counter sesuai keterangan pada kaidah.
                        </span>
                      </div>
                    )}

                    {/* Simple dzikir counter when kaidah mentions hitungan */}
                    {/\b\d+x\b/i.test(item.kaidah || '') && (
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200/70 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-200 text-xs">
                        <Icon name="hash" size={14} />
                        <span>
                          Gunakan tasbih / hitung sendiri. Teks ini memiliki anjuran bacaan berulang (
                          {item.kaidah}
                          ).
                        </span>
                      </div>
                    )}

                    {showLatin && item.latin && (
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 italic tracking-wide leading-relaxed whitespace-pre-line break-words">
                        {highlight(item.latin, searchTerm)}
                      </p>
                    )}

                    {showTranslation && item.translation_id && (
                      <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.translation_id.split('\n\n').map((paragraph, index) => (
                          <p
                            key={`${item.id}-translation-${index}`}
                            className="whitespace-pre-line break-words"
                          >
                            {highlight(paragraph, searchTerm)}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <footer className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-sm text-slate-500 dark:text-slate-400">
                {showSource && item.source && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/60">
                    <Icon name="book" size={12} />
                    {item.source}
                  </span>
                )}
                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-500/20"
                      >
                        <Icon name="hash" size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </footer>

            </div>
          </article>
        );
      })}
>>>>>>> 06c2b1a (Improve prayer cards UX: favorites filter, mobile-friendly layout, concise previews)
    </div>
  );
}
