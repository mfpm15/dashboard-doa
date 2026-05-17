'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Copy, Check, ChevronLeft, ChevronRight, BookOpen, Settings2 } from 'lucide-react';
import { loadPartContent } from '@/content/doa-komprehensif';
import { CollectionPart, AsmaulHusnaItem, ReaderDisplayOptions, DEFAULT_READER_OPTIONS } from '@/types/asmaulHusna';
import { loadReaderOptions, saveReaderOptions, markPartRead, loadHajat, substitutePlaceholders } from '@/lib/asmaulHusnaStorage';

export default function PartReaderPage() {
  const params = useParams();
  const partNumber = Number(params.partNumber);

  const [part, setPart] = useState<CollectionPart | null>(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<ReaderDisplayOptions>(DEFAULT_READER_OPTIONS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    setOptions(loadReaderOptions());
    loadPartContent(partNumber).then(data => {
      setPart(data);
      setLoading(false);
      if (data) markPartRead(partNumber);
    });
  }, [partNumber]);

  const toggleOption = useCallback((key: keyof ReaderDisplayOptions) => {
    setOptions(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      saveReaderOptions(updated);
      return updated;
    });
  }, []);

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* fallback */ }
  }, []);

  const hajat = typeof window !== 'undefined' ? loadHajat() : null;
  const sub = (text: string) => hajat ? substitutePlaceholders(text, hajat) : text;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat bagian {partNumber}...</p>
        </div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Bagian tidak ditemukan.</p>
          <Link href="/koleksi" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Koleksi
          </Link>
        </div>
      </div>
    );
  }

  const TOOLBAR_OPTIONS = [
    { key: 'showArabic' as const, label: 'Arab', emoji: '🔤' },
    { key: 'showLatin' as const, label: 'Latin', emoji: '📝' },
    { key: 'showTranslation' as const, label: 'Terjemahan', emoji: '🌐' },
    { key: 'showExplanation' as const, label: 'Penjelasan', emoji: '💡' },
    { key: 'showEvidence' as const, label: 'Dalil', emoji: '📖' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link
                href="/koleksi"
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                aria-label="Kembali ke koleksi"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    Bagian {part.partNumber}/13
                  </span>
                </div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-xs mt-0.5">
                  {part.title}
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowToolbar(!showToolbar)}
              className={`p-2 rounded-xl transition-colors ${
                showToolbar
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Pengaturan tampilan"
            >
              <Settings2 className="w-5 h-5" />
            </button>
          </div>

          {/* Toolbar */}
          {showToolbar && (
            <div className="pb-3 pt-1 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800 mt-1">
              {TOOLBAR_OPTIONS.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => toggleOption(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    options[key]
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">

        {/* Phase intro card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white mb-6 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full">{part.phaseTitle}</span>
          </div>
          <h2 className="text-lg font-bold mb-2">{part.title}</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">{sub(part.introduction)}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-emerald-200">
            <span>📿 Asmaul Husna ke-{part.asmaRange[0]}–{part.asmaRange[1]}</span>
            <span>⏱ ~{part.estimatedReadMinutes} menit</span>
          </div>
        </div>

        {/* Quran Evidence */}
        {options.showEvidence && part.quranEvidence && part.quranEvidence.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-emerald-500 rounded" />
              Dalil Al-Quran
              <span className="w-4 h-0.5 bg-emerald-500 rounded" />
            </h3>
            <div className="space-y-3">
              {part.quranEvidence.map((ev, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4">
                  {ev.arabic && options.showArabic && (
                    <p className="font-arabic text-right text-xl leading-[2.4] text-gray-900 dark:text-white mb-3" dir="rtl">{ev.arabic}</p>
                  )}
                  {ev.transliteration && options.showLatin && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">{ev.transliteration}</p>
                  )}
                  {ev.translationId && options.showTranslation && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{ev.translationId}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">Quran</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{ev.reference}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hadith Evidence */}
        {options.showEvidence && part.hadithEvidence && part.hadithEvidence.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-amber-500 rounded" />
              Dalil Hadis
              <span className="w-4 h-0.5 bg-amber-500 rounded" />
            </h3>
            <div className="space-y-3">
              {part.hadithEvidence.map((ev, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-amber-100 dark:border-amber-900/30 p-4">
                  {ev.arabic && options.showArabic && (
                    <p className="font-arabic text-right text-xl leading-[2.4] text-gray-900 dark:text-white mb-3" dir="rtl">{ev.arabic}</p>
                  )}
                  {ev.transliteration && options.showLatin && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">{ev.transliteration}</p>
                  )}
                  {ev.translationId && options.showTranslation && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{ev.translationId}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full font-medium">Hadis</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{ev.reference}</span>
                    {ev.verificationStatus === 'sahih' && <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Shahih</span>}
                    {ev.verificationStatus === 'hasan' && <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">✓ Hasan</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {part.items.length} Asmaul Husna
          </span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Asmaul Husna Items */}
        <div className="space-y-4">
          {part.items.map((item) => (
            <AsmaCard key={item.number} item={item} options={options} onCopy={handleCopy} copiedId={copiedId} sub={sub} />
          ))}
        </div>

        {/* Closing Dua */}
        {part.closingDua && (
          <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
              🤲 Doa Penutup Fase {part.partNumber}
            </h3>
            {options.showArabic && part.closingDua.arabic && (
              <p className="font-arabic text-right text-xl leading-[2.4] text-gray-900 dark:text-white mb-3" dir="rtl">
                {sub(part.closingDua.arabic)}
              </p>
            )}
            {options.showLatin && part.closingDua.transliteration && (
              <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2 leading-relaxed">
                {sub(part.closingDua.transliteration)}
              </p>
            )}
            {options.showTranslation && part.closingDua.translationId && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {sub(part.closingDua.translationId)}
              </p>
            )}
          </div>
        )}

        {/* Closing Paragraph */}
        {part.closingParagraph && (
          <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">{sub(part.closingParagraph)}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center gap-3">
          {partNumber > 1 ? (
            <Link
              href={`/koleksi/bagian/${partNumber - 1}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Bagian {partNumber - 1}</span>
              <span className="sm:hidden">Sebelumnya</span>
            </Link>
          ) : (
            <Link
              href="/koleksi"
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Koleksi
            </Link>
          )}

          {partNumber < 13 ? (
            <Link
              href={`/koleksi/bagian/${partNumber + 1}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <span className="hidden sm:inline">Bagian {partNumber + 1}</span>
              <span className="sm:hidden">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/koleksi"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              Selesai 🎉
            </Link>
          )}
        </div>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}

function AsmaCard({
  item,
  options,
  onCopy,
  copiedId,
  sub,
}: {
  item: AsmaulHusnaItem;
  options: ReaderDisplayOptions;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
  sub: (t: string) => string;
}) {
  const copyId = `asma-${item.number}`;
  const isCopied = copiedId === copyId;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0">
              {item.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-arabic text-xl text-gray-900 dark:text-white leading-none">{item.nameArabic}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{item.transliteration}</span>
              </div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{item.meaningId}</p>
            </div>
          </div>
          <button
            onClick={() => {
              const text = [
                item.nameArabic,
                item.transliteration,
                item.meaningId,
                '',
                item.dua.arabic,
                item.dua.transliteration,
                item.dua.translationId,
              ].filter(Boolean).join('\n');
              onCopy(text, copyId);
            }}
            className={`p-2 rounded-xl transition-all ${
              isCopied
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
            }`}
            title="Salin doa"
            aria-label="Salin doa"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Themes */}
        {item.theme && item.theme.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.theme.map(t => (
              <span key={t} className="px-2 py-0.5 bg-white/60 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Explanation */}
        {options.showExplanation && item.explanation && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.explanation}</p>
        )}

        {/* Dua section */}
        {(options.showArabic && item.dua.arabic) || (options.showLatin && item.dua.transliteration) || (options.showTranslation && item.dua.translationId) ? (
          <div className="rounded-xl overflow-hidden border border-emerald-100 dark:border-emerald-900/30">
            <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/30">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">🤲 Doa</span>
            </div>
            <div className="p-4 space-y-3 bg-white dark:bg-gray-900/50">
              {options.showArabic && item.dua.arabic && (
                <p className="font-arabic text-right text-xl leading-[2.4] text-gray-900 dark:text-white" dir="rtl">
                  {sub(item.dua.arabic)}
                </p>
              )}
              {options.showLatin && item.dua.transliteration && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                  {sub(item.dua.transliteration)}
                </p>
              )}
              {options.showTranslation && item.dua.translationId && (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {sub(item.dua.translationId)}
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* Evidence */}
        {options.showEvidence && item.evidence.length > 0 && (
          <div className="space-y-2">
            {item.evidence.map((ev, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
                  ev.type === 'quran'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : ev.type === 'hadith'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {ev.type === 'quran' ? 'QS' : ev.type === 'hadith' ? 'HR' : 'Atsar'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{ev.reference}</p>
                  {ev.translationId && options.showTranslation && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">{ev.translationId}</p>
                  )}
                </div>
                {ev.verificationStatus === 'sahih' && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex-shrink-0">✓</span>
                )}
                {ev.verificationStatus === 'hasan' && (
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold flex-shrink-0">✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
