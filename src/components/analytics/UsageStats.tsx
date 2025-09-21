'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { analytics } from '@/lib/analytics';

interface UsageStatsProps {
  compact?: boolean;
  className?: string;
}

interface QuickStats {
  todayReads: number;
  weeklyReads: number;
  currentStreak: number;
  totalPrayers: number;
  favoriteCategory: string | null;
  averageDaily: number;
}

export function UsageStats({ compact = false, className = '' }: UsageStatsProps) {
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const userStats = analytics.getUserStats();
      const insights = analytics.getInsights();

      if (!userStats) {
        setStats({
          todayReads: 0,
          weeklyReads: 0,
          currentStreak: 0,
          totalPrayers: 0,
          favoriteCategory: null,
          averageDaily: 0
        });
        setIsLoading(false);
        return;
      }

      // Calculate today's reads
      const today = new Date().toDateString();
      const todayEvents = analytics.getEvents({
        type: 'prayer_read',
        dateRange: {
          start: new Date(today).getTime(),
          end: Date.now()
        }
      });

      // Calculate weekly reads
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const weeklyEvents = analytics.getEvents({
        type: 'prayer_read',
        dateRange: {
          start: weekAgo,
          end: Date.now()
        }
      });

      // Calculate average daily reads
      const totalDays = Math.max(1, Math.ceil((Date.now() - userStats.firstUsedDate) / (24 * 60 * 60 * 1000)));
      const averageDaily = userStats.totalPrayersRead / totalDays;

      setStats({
        todayReads: todayEvents.length,
        weeklyReads: weeklyEvents.length,
        currentStreak: userStats.streakDays || 0,
        totalPrayers: userStats.totalPrayersRead || 0,
        favoriteCategory: insights.mostActiveCategory,
        averageDaily
      });
    } catch (error) {
      console.error('Failed to load usage stats:', error);
      setStats({
        todayReads: 0,
        weeklyReads: 0,
        currentStreak: 0,
        totalPrayers: 0,
        favoriteCategory: null,
        averageDaily: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 ${className}`}>
        <div className="text-center py-4">
          <Icon name="globe" size={32} className="mx-auto text-slate-400 dark:text-slate-500 mb-2" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Belum ada data statistik
          </p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-700 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-primary-700 dark:text-primary-300 font-medium">
              Hari ini
            </div>
            <div className="text-xl font-bold text-primary-900 dark:text-primary-100">
              {stats.todayReads}
            </div>
            <div className="text-xs text-primary-600 dark:text-primary-400">
              doa dibaca
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-primary-700 dark:text-primary-300">
              <Icon name="calendar" size={14} />
              {stats.currentStreak} hari
            </div>
            <div className="text-xs text-primary-600 dark:text-primary-400">
              streak aktif
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="globe" size={20} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Statistik Penggunaan
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Today's Reads */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="book-open" size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Hari Ini
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
            {stats.todayReads}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            doa dibaca
          </div>
        </div>

        {/* Weekly Reads */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="calendar" size={16} className="text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              7 Hari
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-1">
            {stats.weeklyReads}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">
            doa dibaca
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="star" size={16} className="text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
              Streak
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-1">
            {stats.currentStreak}
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-300">
            hari berturut
          </div>
        </div>

        {/* Total Prayers */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="layers" size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Total
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
            {stats.totalPrayers}
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300">
            doa dibaca
          </div>
        </div>

        {/* Average Daily */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="clock" size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
              Rata-rata
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-1">
            {stats.averageDaily.toFixed(1)}
          </div>
          <div className="text-xs text-indigo-700 dark:text-indigo-300">
            per hari
          </div>
        </div>

        {/* Favorite Category */}
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="heart" size={16} className="text-pink-600 dark:text-pink-400" />
            <span className="text-sm font-medium text-pink-900 dark:text-pink-100">
              Favorit
            </span>
          </div>
          <div className="text-sm font-bold text-pink-900 dark:text-pink-100 mb-1 truncate">
            {stats.favoriteCategory || 'Belum ada'}
          </div>
          <div className="text-xs text-pink-700 dark:text-pink-300">
            kategori terfavorit
          </div>
        </div>
      </div>

      {/* Progress Motivation */}
      <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="star" size={16} className="text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-900 dark:text-primary-100">
            Motivasi Hari Ini
          </span>
        </div>

        {stats.currentStreak >= 7 ? (
          <p className="text-sm text-primary-800 dark:text-primary-200">
            🎉 Luar biasa! Anda telah konsisten selama {stats.currentStreak} hari!
          </p>
        ) : stats.todayReads >= 3 ? (
          <p className="text-sm text-primary-800 dark:text-primary-200">
            💫 Hari yang produktif! Anda sudah membaca {stats.todayReads} doa hari ini.
          </p>
        ) : stats.todayReads > 0 ? (
          <p className="text-sm text-primary-800 dark:text-primary-200">
            🌟 Awal yang baik! Mari lanjutkan dengan membaca doa lainnya.
          </p>
        ) : (
          <p className="text-sm text-primary-800 dark:text-primary-200">
            🌅 Mulai hari dengan membaca doa pertama Anda!
          </p>
        )}
      </div>
    </div>
  );
}