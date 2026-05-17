'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Copy, Check, ChevronLeft, ChevronRight, BookOpen, Bookmark } from 'lucide-react';
import { loadPartContent } from '@/content/doa-komprehensif';
import { CollectionPart, AsmaulHusnaItem, ReaderDisplayOptions, DEFAULT_READER_OPTIONS } from '@/types/asmaulHusna';
import { loadReaderOptions, saveReaderOptions, markPartRead, loadHajat, substitutePlaceholders, addBookmark } from '@/lib/asmaulHusnaStorage';

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
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500">Memuat bagian {partNumber}...</p>
        </div>
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500">Bagian tidak ditemukan.</p>
          <Link href="/koleksi" className="mt-4 inline-block text-emerald-600 font-semibold">Kembali ke Koleksi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link href="/koleksi" className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                  Bagian {part.partNumber}
                </h1>
                <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-none">{part.phaseTitle}</p>
              </div>
            </div>
            <button
              onClick={() => setShowToolbar(!showToolbar)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {showToolbar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Toolbar */}
          {showToolbar && (
            <div className="pb-3 flex flex-wrap gap-2">
              {(['showArabic', 'showLatin', 'showTranslation', 'showExplanation', 'showEvidence'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => toggleOption(key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    options[key]
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                  }`}
                >
                  {key === 'showArabic' ? 'Arab' : key === 'showLatin' ? 'Latin' : key === 'showTranslation' ? 'Terjemahan' : key === 'showExplanation' ? 'Penjelasan' : 'Dalil'}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{part.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{sub(part.introduction)}</p>
        </div>

        {/* Quran Evidence */}
        {options.showEvidence && part.quranEvidence && part.quranEvidence.length > 0 && (
          <div className="mb-8 space-y-4">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Dalil Al-Quran</h3>
            {part.quranEvidence.map((ev, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                {ev.arabic && options.showArabic && (
                  <p className="font-arabic text-right text-xl leading-[2.2] text-gray-900 dark:text-white mb-3" dir="rtl">{ev.arabic}</p>
                )}
                {ev.transliteration && options.showLatin && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">{ev.transliteration}</p>
                )}
                {ev.translationId && options.showTranslation && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{ev.translationId}</p>
                )}
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">📖 {ev.reference}</p>
              </div>
            ))}
          </div>
        )}

        {/* Asmaul Husna Items */}
        <div className="space-y-6">
          {part.items.map((item) => (
            <AsmaCard key={item.number} item={item} options={options} onCopy={handleCopy} copiedId={copiedId} sub={sub} />
          ))}
        </div>

        {/* Closing */}
        {part.closingParagraph && (
          <div className="mt-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">Doa Penutup Fase {part.partNumber}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{sub(part.closingParagraph)}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          {partNumber > 1 ? (
            <Link href={`/koleksi/bagian/${partNumber - 1}`} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-emerald-300">
              <ChevronLeft className="w-4 h-4" /> Bagian {partNumber - 1}
            </Link>
          ) : <div />}
          {partNumber < 7 ? (
            <Link href={`/koleksi/bagian/${partNumber + 1}`} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
              Bagian {partNumber + 1} <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link href="/koleksi" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
              <BookOpen className="w-4 h-4" /> Kembali ke Koleksi
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function AsmaCard({ item, options, onCopy, copiedId, sub }: { item: AsmaulHusnaItem; options: ReaderDisplayOptions; onCopy: (text: string, id: string) => void; copiedId: string | null; sub: (t: string) => string }) {
  const copyId = `asma-${item.number}`;
  const isCopied = copiedId === copyId;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{item.number}</span>
            <div>
              <span className="font-arabic text-lg text-gray-900 dark:text-white">{item.nameArabic}</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{item.transliteration}</span>
            </div>
          </div>
          <button
            onClick={() => {
              const text = [item.dua.arabic, item.dua.transliteration, item.dua.translationId].filter(Boolean).join('\n\n');
              onCopy(text, copyId);
            }}
            className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            title="Salin doa"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mt-1">{item.meaningId}</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Explanation */}
        {options.showExplanation && item.explanation && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.explanation}</p>
        )}

        {/* Dua Arabic */}
        {options.showArabic && item.dua.arabic && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4" dir="rtl">
            <p className="font-arabic text-xl leading-[2.4] text-gray-900 dark:text-white text-right">
              {sub(item.dua.arabic)}
            </p>
          </div>
        )}

        {/* Dua Latin */}
        {options.showLatin && item.dua.transliteration && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed">{sub(item.dua.transliteration)}</p>
        )}

        {/* Dua Translation */}
        {options.showTranslation && item.dua.translationId && (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{sub(item.dua.translationId)}</p>
        )}

        {/* Evidence */}
        {options.showEvidence && item.evidence.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3 space-y-2">
            {item.evidence.map((ev, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded font-medium ${
                  ev.type === 'quran' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                  ev.type === 'hadith' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-600'
                }`}>
                  {ev.type === 'quran' ? 'Quran' : ev.type === 'hadith' ? 'Hadis' : 'Atsar'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">{ev.reference}</span>
                {ev.verificationStatus === 'sahih' && <span className="text-green-600">✓ Shahih</span>}
                {ev.verificationStatus === 'hasan' && <span className="text-yellow-600">✓ Hasan</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
