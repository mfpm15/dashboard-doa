'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Clock, Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { partsMetadata, COLLECTION_INFO } from '@/content/doa-komprehensif/metadata';
import { loadProgress } from '@/lib/asmaulHusnaStorage';
import { ReadingProgress } from '@/types/asmaulHusna';

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
        <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const completedCount = progress?.completedParts.length || 0;
  const progressPercent = Math.round((completedCount / 13) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Link href="/" className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Koleksi Doa</h1>
              <p className="text-xs text-gray-500">Doa Komprehensif Asmaul Husna</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Star className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{COLLECTION_INFO.title}</h2>
              <p className="text-emerald-100 text-sm leading-relaxed">{COLLECTION_INFO.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{COLLECTION_INFO.totalParts}</div>
              <div className="text-xs text-emerald-200">Bagian</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{COLLECTION_INFO.totalNames}</div>
              <div className="text-xs text-emerald-200">Asmaul Husna</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-xs text-emerald-200">Selesai</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-emerald-200 mb-1">
              <span>Progress Membaca</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* Continue Reading Button */}
          {progress && progress.lastPartRead > 0 && (
            <Link
              href={`/koleksi/bagian/${progress.lastPartRead}`}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Lanjutkan Bagian {progress.lastPartRead}
            </Link>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-sm text-amber-800 dark:text-amber-200">
          <p>{COLLECTION_INFO.disclaimer}</p>
        </div>

        {/* Parts Grid */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">13 Bagian</h3>
        <div className="space-y-3">
          {partsMetadata.map((part) => {
            const isCompleted = progress?.completedParts.includes(part.partNumber);
            const isStub = part.status === 'stub';

            return (
              <Link
                key={part.id}
                href={isStub ? '#' : `/koleksi/bagian/${part.partNumber}`}
                className={`block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition-all ${
                  isStub ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
                onClick={(e) => isStub && e.preventDefault()}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : part.partNumber}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {part.title}
                      </h4>
                      {isStub && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs rounded-full whitespace-nowrap">
                          Segera
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Asmaul Husna ke-{part.asmaRange[0]} s/d {part.asmaRange[1]}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{part.estimatedReadMinutes}m</span>
                    </div>
                    {!isStub && <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
