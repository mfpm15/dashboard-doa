'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Clock, ArrowLeft, CheckCircle2, BookMarked, Sparkles } from 'lucide-react';
import { partsMetadata, COLLECTION_INFO } from '@/content/doa-komprehensif/metadata';
import { loadProgress } from '@/lib/asmaulHusnaStorage';
import { ReadingProgress } from '@/types/asmaulHusna';

const PHASE_COLORS: Record<number, string> = {
  1: 'from-rose-500 to-pink-600',
  2: 'from-violet-500 to-purple-600',
  3: 'from-blue-500 to-indigo-600',
  4: 'from-cyan-500 to-teal-600',
  5: 'from-emerald-500 to-green-600',
  6: 'from-amber-500 to-orange-600',
  7: 'from-teal-500 to-emerald-600',
  8: 'from-sky-500 to-blue-600',
  9: 'from-indigo-500 to-violet-600',
  10: 'from-purple-500 to-fuchsia-600',
  11: 'from-pink-500 to-rose-600',
  12: 'from-orange-500 to-amber-600',
  13: 'from-emerald-600 to-teal-700',
};

export default function KoleksiPage() {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setProgress(loadProgress());
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat koleksi...</p>
        </div>
      </div>
    );
  }

  const completedCount = progress?.completedParts.length || 0;
  const progressPercent = Math.round((completedCount / 13) * 100);
  const totalMinutes = partsMetadata.reduce((sum, p) => sum + p.estimatedReadMinutes, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link
              href="/"
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              aria-label="Kembali ke beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm">
                <BookMarked className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 dark:text-white">Koleksi Doa</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">99 Asmaul Husna • 13 Bagian</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        {/* Hero Card */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white mb-6 shadow-xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex items-start gap-4 mb-5">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold mb-1.5">{COLLECTION_INFO.title}</h2>
                <p className="text-emerald-100 text-sm leading-relaxed line-clamp-2">{COLLECTION_INFO.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { value: COLLECTION_INFO.totalParts, label: 'Bagian' },
                { value: COLLECTION_INFO.totalNames, label: 'Asmaul Husna' },
                { value: `${totalMinutes}m`, label: 'Total Baca' },
                { value: completedCount, label: 'Selesai' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-xl font-bold">{value}</div>
                  <div className="text-xs text-emerald-200 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-emerald-200 mb-1.5">
                <span>Progress Membaca</span>
                <span className="font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5">
                <div
                  className="bg-white rounded-full h-2.5 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Continue Reading */}
            {progress && progress.lastPartRead > 0 && (
              <Link
                href={`/koleksi/bagian/${progress.lastPartRead}`}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                Lanjutkan Bagian {progress.lastPartRead}
              </Link>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 text-base mt-0.5">⚠️</span>
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{COLLECTION_INFO.disclaimer}</p>
          </div>
        </div>

        {/* Parts List */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">13 Bagian Doa</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">{completedCount}/13 selesai</span>
        </div>

        <div className="space-y-2.5">
          {partsMetadata.map((part) => {
            const isCompleted = progress?.completedParts.includes(part.partNumber);
            const isLastRead = progress?.lastPartRead === part.partNumber;
            const colorClass = PHASE_COLORS[part.partNumber] || 'from-emerald-500 to-teal-600';

            return (
              <Link
                key={part.id}
                href={`/koleksi/bagian/${part.partNumber}`}
                className={`group flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border p-4 transition-all duration-200 ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-800/50'
                    : isLastRead
                    ? 'border-emerald-300 dark:border-emerald-700 shadow-sm'
                    : 'border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'
                }`}
              >
                {/* Number badge */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br ${colorClass} shadow-sm`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : part.partNumber}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {part.title}
                    </h4>
                    {isLastRead && !isCompleted && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full whitespace-nowrap font-medium">
                        Terakhir dibaca
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full whitespace-nowrap font-medium">
                        ✓ Selesai
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {part.phaseTitle} • Asmaul Husna ke-{part.asmaRange[0]}–{part.asmaRange[1]}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-gray-400 flex-shrink-0">
                  <div className="flex items-center gap-1 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{part.estimatedReadMinutes}m</span>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Dibaca secara bertahap untuk pemahaman yang lebih mendalam 🤲
          </p>
        </div>
      </div>
    </div>
  );
}
