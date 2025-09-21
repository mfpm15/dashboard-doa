'use client';

import { Item } from '@/types';

// Analytics event types
export interface AnalyticsEvent {
  id: string;
  type: EventType;
  itemId?: string;
  category?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

export type EventType =
  | 'prayer_read'
  | 'prayer_favorited'
  | 'prayer_unfavorited'
  | 'audio_played'
  | 'audio_generated'
  | 'search_performed'
  | 'category_filtered'
  | 'app_opened'
  | 'reading_mode_opened'
  | 'focus_mode_started'
  | 'focus_mode_completed'
  | 'theme_changed'
  | 'prayer_shared'
  | 'offline_used'
  | 'feature_used';

// Analytics storage keys
const ANALYTICS_KEY = 'dashboard_doa_analytics';
const SESSION_KEY = 'dashboard_doa_session';
const USER_STATS_KEY = 'dashboard_doa_user_stats';

// Session management
let currentSessionId: string | null = null;

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId(): string {
  if (currentSessionId) return currentSessionId;

  const stored = localStorage.getItem(SESSION_KEY);
  const sessionData = stored ? JSON.parse(stored) : null;

  // Session expires after 30 minutes of inactivity
  const SESSION_TIMEOUT = 30 * 60 * 1000;
  const now = Date.now();

  if (sessionData && sessionData.id && (now - sessionData.lastActivity) < SESSION_TIMEOUT) {
    currentSessionId = sessionData.id;
    // Update last activity
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: currentSessionId,
      lastActivity: now
    }));
    return currentSessionId!;
  }

  // Create new session
  currentSessionId = generateSessionId();
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: currentSessionId,
    lastActivity: now
  }));

  return currentSessionId;
}

// Analytics data management
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load existing events
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }

      // Track app opening
      this.track('app_opened');

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  track(type: EventType, data?: {
    itemId?: string;
    category?: string;
    metadata?: Record<string, any>;
  }): void {
    try {
      const event: AnalyticsEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        itemId: data?.itemId,
        category: data?.category,
        metadata: data?.metadata,
        timestamp: Date.now(),
        sessionId: getSessionId()
      };

      this.events.push(event);
      this.persistEvents();

      // Update user stats
      this.updateUserStats(event);

    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  private persistEvents(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const maxEvents = 1000;
      if (this.events.length > maxEvents) {
        this.events = this.events.slice(-maxEvents);
      }

      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to persist analytics events:', error);
    }
  }

  private updateUserStats(event: AnalyticsEvent): void {
    try {
      const stored = localStorage.getItem(USER_STATS_KEY);
      const stats = stored ? JSON.parse(stored) : {
        totalPrayersRead: 0,
        totalAudioPlayed: 0,
        totalSearches: 0,
        favoriteCategories: {},
        streakDays: 0,
        lastActiveDate: null,
        firstUsedDate: Date.now(),
        totalSessions: 0,
        totalTimeSpent: 0
      };

      // Update stats based on event type
      switch (event.type) {
        case 'prayer_read':
          stats.totalPrayersRead++;
          if (event.category) {
            stats.favoriteCategories[event.category] = (stats.favoriteCategories[event.category] || 0) + 1;
          }
          break;
        case 'audio_played':
          stats.totalAudioPlayed++;
          break;
        case 'search_performed':
          stats.totalSearches++;
          break;
        case 'app_opened':
          stats.totalSessions++;
          this.updateStreak(stats);
          break;
      }

      stats.lastActiveDate = Date.now();
      localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to update user stats:', error);
    }
  }

  private updateStreak(stats: any): void {
    const today = new Date().toDateString();
    const lastActive = stats.lastActiveDate ? new Date(stats.lastActiveDate).toDateString() : null;

    if (!lastActive) {
      stats.streakDays = 1;
    } else if (lastActive === today) {
      // Same day, don't change streak
      return;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive === yesterday.toDateString()) {
        stats.streakDays++;
      } else {
        stats.streakDays = 1; // Reset streak
      }
    }
  }

  getEvents(filter?: {
    type?: EventType;
    itemId?: string;
    dateRange?: { start: number; end: number };
  }): AnalyticsEvent[] {
    let filtered = [...this.events];

    if (filter?.type) {
      filtered = filtered.filter(e => e.type === filter.type);
    }

    if (filter?.itemId) {
      filtered = filtered.filter(e => e.itemId === filter.itemId);
    }

    if (filter?.dateRange) {
      filtered = filtered.filter(e =>
        e.timestamp >= filter.dateRange!.start &&
        e.timestamp <= filter.dateRange!.end
      );
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }

  getUserStats(): any {
    try {
      const stored = localStorage.getItem(USER_STATS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return null;
    }
  }

  getInsights(): {
    mostReadPrayers: { itemId: string; count: number }[];
    mostActiveCategory: string | null;
    avgPrayersPerSession: number;
    recentActivity: AnalyticsEvent[];
    usagePattern: { hour: number; count: number }[];
  } {
    const prayerCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const hourCounts: Record<number, number> = {};

    // Analyze prayer reading patterns
    const prayerEvents = this.events.filter(e => e.type === 'prayer_read');
    prayerEvents.forEach(event => {
      if (event.itemId) {
        prayerCounts[event.itemId] = (prayerCounts[event.itemId] || 0) + 1;
      }
      if (event.category) {
        categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
      }

      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Most read prayers
    const mostReadPrayers = Object.entries(prayerCounts)
      .map(([itemId, count]) => ({ itemId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Most active category
    const mostActiveCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

    // Average prayers per session
    const sessionCount = new Set(this.events.map(e => e.sessionId)).size;
    const avgPrayersPerSession = sessionCount > 0 ? prayerEvents.length / sessionCount : 0;

    // Recent activity (last 7 days)
    const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentActivity = this.events.filter(e => e.timestamp > weekAgo);

    // Usage pattern by hour
    const usagePattern = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: hourCounts[hour] || 0
    }));

    return {
      mostReadPrayers,
      mostActiveCategory,
      avgPrayersPerSession,
      recentActivity,
      usagePattern
    };
  }

  exportData(): {
    events: AnalyticsEvent[];
    stats: any;
    insights: any;
    exportedAt: number;
  } {
    return {
      events: this.events,
      stats: this.getUserStats(),
      insights: this.getInsights(),
      exportedAt: Date.now()
    };
  }

  clearData(): void {
    this.events = [];
    localStorage.removeItem(ANALYTICS_KEY);
    localStorage.removeItem(USER_STATS_KEY);
    localStorage.removeItem(SESSION_KEY);
    currentSessionId = null;
  }
}

// Convenience functions
export const analytics = AnalyticsManager.getInstance();

export function trackPrayerRead(item: Item): void {
  analytics.track('prayer_read', {
    itemId: item.id,
    category: item.category,
    metadata: {
      title: item.title,
      hasArabic: !!item.arabic,
      hasLatin: !!item.latin,
      hasTranslation: !!item.translation_id,
      isFavorite: item.favorite
    }
  });
}

export function trackAudioPlayed(item: Item, trackTitle: string): void {
  analytics.track('audio_played', {
    itemId: item.id,
    category: item.category,
    metadata: {
      trackTitle,
      prayerTitle: item.title
    }
  });
}

export function trackSearch(query: string, resultsCount: number): void {
  analytics.track('search_performed', {
    metadata: {
      query,
      resultsCount
    }
  });
}

export function trackFeatureUsed(feature: string, metadata?: Record<string, any>): void {
  analytics.track('feature_used', {
    metadata: {
      feature,
      ...metadata
    }
  });
}