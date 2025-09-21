'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { analytics, AnalyticsEvent } from '@/lib/analytics';

interface AnalyticsDashboardProps {
  onClose?: () => void;
  className?: string;
}

interface UserStats {
  totalPrayersRead: number;
  totalAudioPlayed: number;
  totalSearches: number;
  favoriteCategories: Record<string, number>;
  streakDays: number;
  lastActiveDate: number;
  firstUsedDate: number;
  totalSessions: number;
}

interface InsightData {
  mostReadPrayers: { itemId: string; count: number }[];
  mostActiveCategory: string | null;
  avgPrayersPerSession: number;
  recentActivity: AnalyticsEvent[];
  usagePattern: { hour: number; count: number }[];
}

export function AnalyticsDashboard({ onClose, className = '' }: AnalyticsDashboardProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'prayers'>('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = () => {
    const stats = analytics.getUserStats();
    const insightData = analytics.getInsights();

    setUserStats(stats);
    setInsights(insightData);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getUsageTrend = () => {
    if (!insights) return [];

    const now = Date.now();
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
    const startDate = now - (days * 24 * 60 * 60 * 1000);

    const dailyCount: Record<string, number> = {};

    insights.recentActivity
      .filter(event => event.timestamp >= startDate)
      .forEach(event => {
        const date = new Date(event.timestamp).toDateString();
        dailyCount[date] = (dailyCount[date] || 0) + 1;
      });

    return Object.entries(dailyCount)
      .map(([date, count]) => ({
        date: new Date(date),
        count
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const exportAnalytics = () => {
    const data = analytics.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-doa-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAnalytics = () => {
    if (confirm('Yakin ingin menghapus semua data analitik? Tindakan ini tidak dapat dibatalkan.')) {
      analytics.clearData();
      setUserStats(null);
      setInsights(null);
    }
  };

  if (!userStats || !insights) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const usageTrend = getUsageTrend();
  const maxCount = Math.max(...usageTrend.map(d => d.count), 1);

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Analitik Penggunaan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pantau aktivitas dan pola penggunaan aplikasi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportAnalytics}
            className="btn btn-secondary btn-sm"
            title="Ekspor data analitik"
          >
            <Icon name="download" size={14} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-ghost p-2"
            >
              <Icon name="x" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {[
          { key: 'overview', label: 'Ringkasan', icon: 'bar-chart' },
          { key: 'patterns', label: 'Pola Penggunaan', icon: 'activity' },
          { key: 'prayers', label: 'Doa Favorit', icon: 'star' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Icon name={tab.icon as any} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'week', label: '7 Hari' },
            { key: 'month', label: '30 Hari' },
            { key: 'all', label: 'Semua' }
          ].map(range => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key as any)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                timeRange === range.key
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Icon name="book-open" size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Doa Dibaca</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {userStats.totalPrayersRead}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Icon name="volume" size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Audio Diputar</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {userStats.totalAudioPlayed}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Icon name="search" size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Pencarian</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {userStats.totalSearches}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Icon name="calendar" size={20} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Streak</p>
                    <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {userStats.streakDays} hari
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
                Aktivitas Harian
              </h3>
              <div className="h-32 flex items-end gap-1">
                {usageTrend.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-primary-200 dark:bg-primary-800 rounded-t"
                    style={{
                      height: `${(data.count / maxCount) * 100}%`,
                      minHeight: data.count > 0 ? '4px' : '2px'
                    }}
                    title={`${data.date.toLocaleDateString()}: ${data.count} aktivitas`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span>{timeRange === 'week' ? '7 hari' : timeRange === 'month' ? '30 hari' : '90 hari'} yang lalu</span>
                <span>Hari ini</span>
              </div>
            </div>
          </div>
        )}

        {/* Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {/* Usage Pattern by Hour */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
                Pola Penggunaan per Jam
              </h3>
              <div className="grid grid-cols-12 gap-1">
                {insights.usagePattern.map(({ hour, count }) => (
                  <div key={hour} className="text-center">
                    <div
                      className="bg-primary-200 dark:bg-primary-800 rounded mb-1 mx-auto"
                      style={{
                        height: `${Math.max((count / Math.max(...insights.usagePattern.map(p => p.count), 1)) * 60, 2)}px`,
                        width: '100%'
                      }}
                      title={`${hour}:00 - ${count} aktivitas`}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {hour.toString().padStart(2, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
                Kategori Favorit
              </h3>
              <div className="space-y-2">
                {Object.entries(userStats.favoriteCategories)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count]) => {
                    const total = Object.values(userStats.favoriteCategories).reduce((a, b) => a + b, 0);
                    const percentage = (count / total) * 100;

                    return (
                      <div key={category} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400 min-w-24">
                          {category}
                        </span>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 min-w-12 text-right">
                          {count}x
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Prayers Tab */}
        {activeTab === 'prayers' && (
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">
              Doa Paling Sering Dibaca
            </h3>
            <div className="space-y-2">
              {insights.mostReadPrayers.slice(0, 10).map((prayer, index) => (
                <div
                  key={prayer.itemId}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      ID: {prayer.itemId}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Dibaca {prayer.count} kali
                    </p>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {prayer.count}x
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Bergabung sejak {formatDate(userStats.firstUsedDate)}
          </div>
          <button
            onClick={clearAnalytics}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Hapus Data Analitik
          </button>
        </div>
      </div>
    </div>
  );
}