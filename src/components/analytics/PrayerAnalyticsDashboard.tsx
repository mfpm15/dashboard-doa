'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Item } from '@/types';

interface PrayerStats {
  totalPrayers: number;
  readToday: number;
  currentStreak: number;
  longestStreak: number;
  totalReadingTime: number; // in minutes
  favoriteCategory: string;
  mostReadPrayer: string;
  readingTimeToday: number;
  weeklyProgress: number[];
  categoryBreakdown: { [key: string]: number };
  timeOfDayStats: { [key: string]: number };
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: number;
}

interface ReadingSession {
  itemId: string;
  title: string;
  category: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  date: string;
}

interface PrayerAnalyticsDashboardProps {
  items: Item[];
  className?: string;
}

export function PrayerAnalyticsDashboard({ items, className = '' }: PrayerAnalyticsDashboardProps) {
  const [stats, setStats] = useState<PrayerStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [items, selectedPeriod]);

  const loadAnalyticsData = () => {
    setLoading(true);

    try {
      // Load reading sessions from localStorage
      const storedSessions = localStorage.getItem('prayer_reading_sessions');
      const sessions: ReadingSession[] = storedSessions ? JSON.parse(storedSessions) : [];
      setReadingSessions(sessions);

      // Calculate stats
      const calculatedStats = calculateStats(sessions);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessions: ReadingSession[]): PrayerStats => {
    const now = new Date();
    const today = now.toDateString();
    const thisWeek = getWeekRange(now);

    // Filter sessions by period
    let filteredSessions = sessions;
    if (selectedPeriod === 'week') {
      filteredSessions = sessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= thisWeek.start && sessionDate <= thisWeek.end;
      });
    } else if (selectedPeriod === 'month') {
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredSessions = sessions.filter(s => new Date(s.startTime) >= thisMonth);
    }

    // Calculate basic stats
    const readToday = sessions.filter(s => s.date === today).length;
    const totalReadingTime = Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60);
    const readingTimeToday = Math.round(
      sessions.filter(s => s.date === today).reduce((sum, s) => sum + s.duration, 0) / 60
    );

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(sessions);

    // Weekly progress (last 7 days)
    const weeklyProgress = calculateWeeklyProgress(sessions);

    // Category breakdown
    const categoryBreakdown: { [key: string]: number } = {};
    filteredSessions.forEach(session => {
      categoryBreakdown[session.category] = (categoryBreakdown[session.category] || 0) + 1;
    });

    // Time of day stats
    const timeOfDayStats = calculateTimeOfDayStats(filteredSessions);

    // Find favorite category and most read prayer
    const favoriteCategory = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Belum ada';

    const prayerCounts: { [key: string]: number } = {};
    filteredSessions.forEach(session => {
      prayerCounts[session.title] = (prayerCounts[session.title] || 0) + 1;
    });
    const mostReadPrayer = Object.entries(prayerCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Belum ada';

    // Calculate achievements
    const achievements = calculateAchievements(sessions);

    return {
      totalPrayers: items.length,
      readToday,
      currentStreak,
      longestStreak,
      totalReadingTime,
      favoriteCategory,
      mostReadPrayer,
      readingTimeToday,
      weeklyProgress,
      categoryBreakdown,
      timeOfDayStats,
      achievements
    };
  };

  const calculateStreaks = (sessions: ReadingSession[]): { currentStreak: number; longestStreak: number } => {
    if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = session.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
    }, {} as { [key: string]: ReadingSession[] });

    const dates = Object.keys(sessionsByDate).sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate streaks
    const today = new Date().toDateString();
    let checkDate = new Date();

    // Check current streak (backwards from today)
    while (true) {
      const dateStr = checkDate.toDateString();
      if (sessionsByDate[dateStr] && sessionsByDate[dateStr].length > 0) {
        currentStreak++;
      } else if (dateStr !== today) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    for (let i = 0; i < dates.length; i++) {
      tempStreak = 1;
      for (let j = i + 1; j < dates.length; j++) {
        const currentDate = new Date(dates[j]);
        const prevDate = new Date(dates[j - 1]);
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { currentStreak, longestStreak };
  };

  const calculateWeeklyProgress = (sessions: ReadingSession[]): number[] => {
    const progress = new Array(7).fill(0);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      const dayCount = sessions.filter(s => s.date === dateStr).length;
      progress[6 - i] = dayCount;
    }

    return progress;
  };

  const calculateTimeOfDayStats = (sessions: ReadingSession[]): { [key: string]: number } => {
    const timeStats = {
      'Pagi (05-11)': 0,
      'Siang (12-16)': 0,
      'Sore (17-19)': 0,
      'Malam (20-04)': 0
    };

    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      if (hour >= 5 && hour <= 11) timeStats['Pagi (05-11)']++;
      else if (hour >= 12 && hour <= 16) timeStats['Siang (12-16)']++;
      else if (hour >= 17 && hour <= 19) timeStats['Sore (17-19)']++;
      else timeStats['Malam (20-04)']++;
    });

    return timeStats;
  };

  const calculateAchievements = (sessions: ReadingSession[]): Achievement[] => {
    const achievements: Achievement[] = [
      {
        id: 'first_prayer',
        title: 'Doa Pertama',
        description: 'Membaca doa pertama kali',
        icon: 'star',
        progress: Math.min(sessions.length, 1),
        target: 1,
        unlocked: sessions.length >= 1
      },
      {
        id: 'daily_reader',
        title: 'Pembaca Harian',
        description: 'Membaca doa setiap hari selama 7 hari',
        icon: 'calendar',
        progress: Math.min(calculateStreaks(sessions).currentStreak, 7),
        target: 7,
        unlocked: calculateStreaks(sessions).currentStreak >= 7
      },
      {
        id: 'prayer_explorer',
        title: 'Penjelajah Doa',
        description: 'Membaca doa dari 5 kategori berbeda',
        icon: 'compass',
        progress: Math.min(Object.keys(calculateCategoryBreakdown(sessions)).length, 5),
        target: 5,
        unlocked: Object.keys(calculateCategoryBreakdown(sessions)).length >= 5
      },
      {
        id: 'dedicated_reader',
        title: 'Pembaca Rajin',
        description: 'Total waktu bacaan 60 menit',
        icon: 'clock',
        progress: Math.min(Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60), 60),
        target: 60,
        unlocked: sessions.reduce((sum, s) => sum + s.duration, 0) >= 3600
      },
      {
        id: 'consistent_reader',
        title: 'Pembaca Konsisten',
        description: 'Streak 30 hari',
        icon: 'trending-up',
        progress: Math.min(calculateStreaks(sessions).longestStreak, 30),
        target: 30,
        unlocked: calculateStreaks(sessions).longestStreak >= 30
      }
    ];

    return achievements;
  };

  const calculateCategoryBreakdown = (sessions: ReadingSession[]): { [key: string]: number } => {
    const breakdown: { [key: string]: number } = {};
    sessions.forEach(session => {
      breakdown[session.category] = (breakdown[session.category] || 0) + 1;
    });
    return breakdown;
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  const getDayName = (index: number): string => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[index];
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Analytics Spiritual
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Pantau progress ibadah dan kebiasaan doa Anda
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          {(['week', 'month', 'year'] as const).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {period === 'week' ? 'Minggu' : period === 'month' ? 'Bulan' : 'Tahun'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Hari Ini</p>
              <p className="text-2xl font-bold">{stats.readToday}</p>
            </div>
            <Icon name="book-open" size={24} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Streak Saat Ini</p>
              <p className="text-2xl font-bold">{stats.currentStreak}</p>
            </div>
            <Icon name="trending-up" size={24} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Waktu Hari Ini</p>
              <p className="text-2xl font-bold">{formatDuration(stats.readingTimeToday)}</p>
            </div>
            <Icon name="clock" size={24} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Waktu</p>
              <p className="text-2xl font-bold">{formatDuration(stats.totalReadingTime)}</p>
            </div>
            <Icon name="award" size={24} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Progress 7 Hari Terakhir
        </h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {stats.weeklyProgress.map((count, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-primary-500 rounded-t-md transition-all duration-300"
                style={{
                  height: `${Math.max((count / Math.max(...stats.weeklyProgress, 1)) * 100, 4)}%`
                }}
              ></div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                {getDayName(index)}
              </div>
              <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Kategori Favorit
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => {
                const maxCount = Math.max(...Object.values(stats.categoryBreakdown));
                const percentage = (count / maxCount) * 100;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{category}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{count}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Pencapaian
          </h3>
          <div className="space-y-3">
            {stats.achievements.slice(0, 5).map(achievement => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked
                      ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon name={achievement.icon as any} size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {achievement.title}
                      </h4>
                      {achievement.unlocked && (
                        <Icon name="check" size={16} className="text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {achievement.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${(achievement.progress / achievement.target) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Statistik Cepat
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats.longestStreak}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Streak Terpanjang</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stats.favoriteCategory}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Kategori Favorit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 truncate">
              {stats.mostReadPrayer.length > 15
                ? stats.mostReadPrayer.substring(0, 15) + '...'
                : stats.mostReadPrayer}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Doa Paling Dibaca</div>
          </div>
        </div>
      </div>
    </div>
  );
}