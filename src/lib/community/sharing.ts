/**
 * Community Sharing System for Islamic Prayer Dashboard
 * Enables prayer sharing, inspiration posts, and community engagement
 */

import { Item } from '@/types';

export interface SharedPrayer {
  id: string;
  prayerId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  reflection?: string;
  intention?: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  isPublic: boolean;
  language: 'id' | 'ar' | 'en';
  source?: string;
  verified: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface InspirationPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'reflection' | 'gratitude' | 'intention' | 'achievement' | 'quote';
  title: string;
  content: string;
  relatedPrayers: string[]; // Prayer IDs
  tags: string[];
  timestamp: Date;
  likes: number;
  comments: Comment[];
  isPublic: boolean;
  featured: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  joinDate: Date;
  stats: {
    prayersShared: number;
    inspirationsPosted: number;
    likesReceived: number;
    commentsPosted: number;
    streak: number;
    totalPrayers: number;
  };
  preferences: {
    shareAnalytics: boolean;
    allowComments: boolean;
    languagePreference: 'id' | 'ar' | 'en';
    notificationSettings: {
      likes: boolean;
      comments: boolean;
      mentions: boolean;
      featured: boolean;
    };
  };
  achievements: string[];
}

export interface SharingStats {
  totalShares: number;
  totalLikes: number;
  totalComments: number;
  popularPrayers: { prayerId: string; title: string; shares: number }[];
  engagementRate: number;
  weeklyGrowth: number;
  topContributors: { userId: string; userName: string; contributions: number }[];
}

class CommunityManager {
  private currentUser: UserProfile | null = null;
  private sharedPrayers: SharedPrayer[] = [];
  private inspirationPosts: InspirationPost[] = [];
  private isOffline = true; // For demo purposes, simulating offline mode

  constructor() {
    this.loadFromStorage();
    this.initDefaultUser();
  }

  private initDefaultUser(): void {
    if (!this.currentUser) {
      this.currentUser = {
        id: 'user-' + Date.now(),
        name: 'Pengguna Dashboard Doa',
        joinDate: new Date(),
        stats: {
          prayersShared: 0,
          inspirationsPosted: 0,
          likesReceived: 0,
          commentsPosted: 0,
          streak: 0,
          totalPrayers: 0
        },
        preferences: {
          shareAnalytics: true,
          allowComments: true,
          languagePreference: 'id',
          notificationSettings: {
            likes: true,
            comments: true,
            mentions: true,
            featured: true
          }
        },
        achievements: []
      };
      this.saveToStorage();
    }
  }

  // Prayer Sharing Methods
  async sharePrayer(
    prayer: Item,
    options: {
      reflection?: string;
      intention?: string;
      isPublic?: boolean;
      tags?: string[];
    } = {}
  ): Promise<string> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const sharedPrayer: SharedPrayer = {
      id: 'shared-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      prayerId: prayer.id,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      title: prayer.title,
      content: prayer.arabic || prayer.latin || prayer.translation_id || '',
      category: prayer.category,
      tags: options.tags || prayer.tags,
      reflection: options.reflection,
      intention: options.intention,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      isPublic: options.isPublic ?? true,
      language: 'id',
      verified: false
    };

    this.sharedPrayers.unshift(sharedPrayer);
    this.currentUser.stats.prayersShared++;
    this.saveToStorage();

    return sharedPrayer.id;
  }

  async shareInspiration(
    type: InspirationPost['type'],
    title: string,
    content: string,
    options: {
      relatedPrayers?: string[];
      tags?: string[];
      isPublic?: boolean;
    } = {}
  ): Promise<string> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const post: InspirationPost = {
      id: 'inspiration-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      type,
      title,
      content,
      relatedPrayers: options.relatedPrayers || [],
      tags: options.tags || [],
      timestamp: new Date(),
      likes: 0,
      comments: [],
      isPublic: options.isPublic ?? true,
      featured: false
    };

    this.inspirationPosts.unshift(post);
    this.currentUser.stats.inspirationsPosted++;
    this.saveToStorage();

    return post.id;
  }

  // Content Retrieval Methods
  getSharedPrayers(filters: {
    category?: string;
    language?: string;
    tags?: string[];
    userId?: string;
    limit?: number;
    offset?: number;
  } = {}): SharedPrayer[] {
    let filtered = [...this.sharedPrayers];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.language) {
      filtered = filtered.filter(p => p.language === filters.language);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p =>
        p.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    if (filters.userId) {
      filtered = filtered.filter(p => p.userId === filters.userId);
    }

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 20;

    return filtered.slice(offset, offset + limit);
  }

  getInspirationPosts(filters: {
    type?: InspirationPost['type'];
    tags?: string[];
    userId?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}): InspirationPost[] {
    let filtered = [...this.inspirationPosts];

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(p =>
        p.tags.some(tag => filters.tags!.includes(tag))
      );
    }

    if (filters.userId) {
      filtered = filtered.filter(p => p.userId === filters.userId);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(p => p.featured === filters.featured);
    }

    const offset = filters.offset || 0;
    const limit = filters.limit || 20;

    return filtered.slice(offset, offset + limit);
  }

  // Engagement Methods
  async likePrayer(prayerId: string): Promise<boolean> {
    const prayer = this.sharedPrayers.find(p => p.id === prayerId);
    if (!prayer) return false;

    prayer.likes++;
    this.saveToStorage();
    return true;
  }

  async likeInspiration(postId: string): Promise<boolean> {
    const post = this.inspirationPosts.find(p => p.id === postId);
    if (!post) return false;

    post.likes++;
    this.saveToStorage();
    return true;
  }

  async addComment(
    targetId: string,
    content: string,
    type: 'prayer' | 'inspiration'
  ): Promise<string> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    const comment: Comment = {
      id: 'comment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar,
      content,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    if (type === 'prayer') {
      const prayer = this.sharedPrayers.find(p => p.id === targetId);
      if (prayer) {
        prayer.comments.push(comment);
      }
    } else {
      const post = this.inspirationPosts.find(p => p.id === targetId);
      if (post) {
        post.comments.push(comment);
      }
    }

    this.currentUser.stats.commentsPosted++;
    this.saveToStorage();
    return comment.id;
  }

  // Search and Discovery
  searchCommunityContent(query: string, type?: 'prayers' | 'inspirations'): {
    prayers: SharedPrayer[];
    inspirations: InspirationPost[];
  } {
    const searchTerm = query.toLowerCase();

    const prayers = type === 'inspirations' ? [] : this.sharedPrayers.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.content.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (p.reflection && p.reflection.toLowerCase().includes(searchTerm))
    );

    const inspirations = type === 'prayers' ? [] : this.inspirationPosts.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.content.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    return { prayers, inspirations };
  }

  getTrendingTags(limit: number = 10): string[] {
    const tagCounts: { [tag: string]: number } = {};

    // Count tags from prayers
    this.sharedPrayers.forEach(prayer => {
      prayer.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Count tags from inspirations
    this.inspirationPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  // Analytics and Stats
  getSharingStats(): SharingStats {
    const totalShares = this.sharedPrayers.length;
    const totalLikes = this.sharedPrayers.reduce((sum, p) => sum + p.likes, 0) +
                      this.inspirationPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = this.sharedPrayers.reduce((sum, p) => sum + p.comments.length, 0) +
                         this.inspirationPosts.reduce((sum, p) => sum + p.comments.length, 0);

    // Calculate popular prayers
    const prayerCounts: { [prayerId: string]: { title: string; count: number } } = {};
    this.sharedPrayers.forEach(prayer => {
      if (!prayerCounts[prayer.prayerId]) {
        prayerCounts[prayer.prayerId] = { title: prayer.title, count: 0 };
      }
      prayerCounts[prayer.prayerId].count++;
    });

    const popularPrayers = Object.entries(prayerCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([prayerId, data]) => ({
        prayerId,
        title: data.title,
        shares: data.count
      }));

    // Calculate engagement rate
    const engagementRate = totalShares > 0 ? ((totalLikes + totalComments) / totalShares) : 0;

    return {
      totalShares,
      totalLikes,
      totalComments,
      popularPrayers,
      engagementRate,
      weeklyGrowth: 0, // Would be calculated from time-series data in real app
      topContributors: [] // Would be calculated from user data in real app
    };
  }

  // User Management
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  updateUserProfile(updates: Partial<UserProfile>): boolean {
    if (!this.currentUser) return false;

    this.currentUser = { ...this.currentUser, ...updates };
    this.saveToStorage();
    return true;
  }

  updateUserPreferences(preferences: Partial<UserProfile['preferences']>): boolean {
    if (!this.currentUser) return false;

    this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
    this.saveToStorage();
    return true;
  }

  // Storage Methods
  private saveToStorage(): void {
    try {
      localStorage.setItem('community_shared_prayers', JSON.stringify(this.sharedPrayers));
      localStorage.setItem('community_inspiration_posts', JSON.stringify(this.inspirationPosts));
      localStorage.setItem('community_user_profile', JSON.stringify(this.currentUser));
    } catch (error) {
      console.warn('Could not save community data:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const prayers = localStorage.getItem('community_shared_prayers');
      if (prayers) {
        this.sharedPrayers = JSON.parse(prayers).map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        }));
      }

      const posts = localStorage.getItem('community_inspiration_posts');
      if (posts) {
        this.inspirationPosts = JSON.parse(posts).map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        }));
      }

      const user = localStorage.getItem('community_user_profile');
      if (user) {
        this.currentUser = JSON.parse(user);
        if (this.currentUser) {
          this.currentUser.joinDate = new Date(this.currentUser.joinDate);
        }
      }
    } catch (error) {
      console.warn('Could not load community data:', error);
    }
  }

  // Export/Import Methods for Demo
  exportData(): string {
    return JSON.stringify({
      prayers: this.sharedPrayers,
      inspirations: this.inspirationPosts,
      user: this.currentUser
    });
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      this.sharedPrayers = parsed.prayers || [];
      this.inspirationPosts = parsed.inspirations || [];
      this.currentUser = parsed.user || this.currentUser;
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const communityManager = new CommunityManager();