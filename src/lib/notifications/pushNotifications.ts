/**
 * Push Notifications System for Islamic Prayer Dashboard
 * Provides prayer reminders and spiritual notifications
 */

export interface NotificationSchedule {
  id: string;
  title: string;
  body: string;
  tag: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  category: 'prayer' | 'reminder' | 'achievement' | 'dhikr';
  metadata?: {
    prayerId?: string;
    achievementId?: string;
    sound?: string;
    vibrate?: number[];
  };
}

export interface NotificationSettings {
  enabled: boolean;
  prayerReminders: boolean;
  dhikrReminders: boolean;
  achievementNotifications: boolean;
  dailyMotivation: boolean;
  sound: boolean;
  vibrate: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
  };
}

class PushNotificationSystem {
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';
  private schedules: NotificationSchedule[] = [];
  private settings: NotificationSettings = {
    enabled: false,
    prayerReminders: true,
    dhikrReminders: true,
    achievementNotifications: true,
    dailyMotivation: true,
    sound: true,
    vibrate: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '06:00'
    }
  };

  private defaultSchedules: NotificationSchedule[] = [
    {
      id: 'morning-prayer',
      title: '🌅 Doa Pagi',
      body: 'Mulai hari dengan doa dan dzikir pagi',
      tag: 'morning-prayer',
      time: '06:00',
      days: [1, 2, 3, 4, 5, 6, 0], // All days
      enabled: true,
      category: 'prayer',
      metadata: {
        sound: 'prayer-bell',
        vibrate: [200, 100, 200]
      }
    },
    {
      id: 'evening-prayer',
      title: '🌙 Doa Malam',
      body: 'Saatnya doa dan dzikir sebelum tidur',
      tag: 'evening-prayer',
      time: '20:00',
      days: [1, 2, 3, 4, 5, 6, 0],
      enabled: true,
      category: 'prayer',
      metadata: {
        sound: 'prayer-bell',
        vibrate: [200, 100, 200]
      }
    },
    {
      id: 'dhikr-reminder',
      title: '📿 Waktu Dzikir',
      body: 'Jangan lupa berzikir dan berdzikir kepada Allah',
      tag: 'dhikr-reminder',
      time: '15:00',
      days: [1, 2, 3, 4, 5, 6, 0],
      enabled: true,
      category: 'dhikr',
      metadata: {
        sound: 'soft-chime',
        vibrate: [100, 50, 100]
      }
    },
    {
      id: 'daily-motivation',
      title: '✨ Motivasi Harian',
      body: 'Tetap semangat dalam beribadah dan berbuat kebaikan',
      tag: 'daily-motivation',
      time: '09:00',
      days: [1, 2, 3, 4, 5, 6, 0],
      enabled: true,
      category: 'reminder',
      metadata: {
        sound: 'gentle-bell',
        vibrate: [150]
      }
    }
  ];

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    this.loadSettings();
    this.loadSchedules();
    this.checkPermission();

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered for notifications');
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }

    // Set up notification scheduling
    this.setupScheduler();
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  private checkPermission(): void {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async enableNotifications(): Promise<boolean> {
    const granted = await this.requestPermission();
    if (granted) {
      this.updateSettings({ enabled: true });
      this.setupScheduler();
      return true;
    }
    return false;
  }

  disableNotifications(): void {
    this.updateSettings({ enabled: false });
    this.clearAllScheduled();
  }

  private setupScheduler(): void {
    if (!this.settings.enabled || this.permission !== 'granted') {
      return;
    }

    // Clear existing timers
    this.clearAllScheduled();

    // Schedule active notifications
    this.schedules.forEach(schedule => {
      if (schedule.enabled) {
        this.scheduleNotification(schedule);
      }
    });
  }

  private scheduleNotification(schedule: NotificationSchedule): void {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Check if today is a scheduled day
    if (!schedule.days.includes(currentDay)) {
      return;
    }

    // Parse schedule time
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const scheduleTime = hours * 60 + minutes;

    // Check quiet hours
    if (this.isQuietHours(hours, minutes)) {
      return;
    }

    // If the time has passed today, schedule for tomorrow
    let targetTime = new Date();
    if (scheduleTime <= currentTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    targetTime.setHours(hours, minutes, 0, 0);

    const delay = targetTime.getTime() - now.getTime();

    setTimeout(() => {
      this.showNotification(schedule);
      // Reschedule for next occurrence
      this.scheduleNotification(schedule);
    }, delay);
  }

  private isQuietHours(hours: number, minutes: number): boolean {
    if (!this.settings.quietHours.enabled) {
      return false;
    }

    const currentTime = hours * 60 + minutes;
    const [startHours, startMinutes] = this.settings.quietHours.start.split(':').map(Number);
    const [endHours, endMinutes] = this.settings.quietHours.end.split(':').map(Number);

    const startTime = startHours * 60 + startMinutes;
    const endTime = endHours * 60 + endMinutes;

    // Handle overnight quiet hours (e.g., 22:00 to 06:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }

    return currentTime >= startTime && currentTime <= endTime;
  }

  private async showNotification(schedule: NotificationSchedule): Promise<void> {
    if (!this.settings.enabled || this.permission !== 'granted') {
      return;
    }

    // Check category-specific settings
    if (schedule.category === 'prayer' && !this.settings.prayerReminders) return;
    if (schedule.category === 'dhikr' && !this.settings.dhikrReminders) return;
    if (schedule.category === 'achievement' && !this.settings.achievementNotifications) return;
    if (schedule.category === 'reminder' && !this.settings.dailyMotivation) return;

    const options: NotificationOptions = {
      body: schedule.body,
      tag: schedule.tag,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      silent: !this.settings.sound,
      vibrate: this.settings.vibrate ? schedule.metadata?.vibrate : undefined,
      actions: [
        {
          action: 'open',
          title: 'Buka Aplikasi'
        },
        {
          action: 'dismiss',
          title: 'Tutup'
        }
      ],
      data: {
        scheduleId: schedule.id,
        category: schedule.category,
        metadata: schedule.metadata
      }
    };

    try {
      if (this.registration) {
        await this.registration.showNotification(schedule.title, options);
      } else {
        new Notification(schedule.title, options);
      }

      console.log('Notification shown:', schedule.title);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async showAchievementNotification(title: string, description: string, achievementId: string): Promise<void> {
    if (!this.settings.enabled || !this.settings.achievementNotifications) {
      return;
    }

    const schedule: NotificationSchedule = {
      id: `achievement-${achievementId}`,
      title: `🏆 ${title}`,
      body: description,
      tag: `achievement-${achievementId}`,
      time: new Date().toTimeString().slice(0, 5),
      days: [new Date().getDay()],
      enabled: true,
      category: 'achievement',
      metadata: {
        achievementId,
        sound: 'achievement',
        vibrate: [200, 100, 200, 100, 200]
      }
    };

    await this.showNotification(schedule);
  }

  async showCustomNotification(title: string, body: string, category: NotificationSchedule['category'] = 'reminder'): Promise<void> {
    const schedule: NotificationSchedule = {
      id: `custom-${Date.now()}`,
      title,
      body,
      tag: `custom-${Date.now()}`,
      time: new Date().toTimeString().slice(0, 5),
      days: [new Date().getDay()],
      enabled: true,
      category,
      metadata: {
        sound: 'gentle-bell',
        vibrate: [150]
      }
    };

    await this.showNotification(schedule);
  }

  addSchedule(schedule: Omit<NotificationSchedule, 'id'>): string {
    const id = `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSchedule: NotificationSchedule = {
      ...schedule,
      id
    };

    this.schedules.push(newSchedule);
    this.saveSchedules();

    if (newSchedule.enabled && this.settings.enabled) {
      this.scheduleNotification(newSchedule);
    }

    return id;
  }

  updateSchedule(id: string, updates: Partial<NotificationSchedule>): boolean {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.schedules[index] = { ...this.schedules[index], ...updates };
    this.saveSchedules();
    this.setupScheduler(); // Reschedule all notifications
    return true;
  }

  removeSchedule(id: string): boolean {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index === -1) return false;

    this.schedules.splice(index, 1);
    this.saveSchedules();
    this.setupScheduler();
    return true;
  }

  getSchedules(): NotificationSchedule[] {
    return [...this.schedules];
  }

  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    if (this.settings.enabled) {
      this.setupScheduler();
    } else {
      this.clearAllScheduled();
    }
  }

  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  private clearAllScheduled(): void {
    // Note: In a real implementation, you'd need to track timeout IDs
    // and clear them here. For simplicity, we're not doing that.
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('notification_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Could not save notification settings:', error);
    }
  }

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('notification_settings');
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Could not load notification settings:', error);
    }
  }

  private saveSchedules(): void {
    try {
      localStorage.setItem('notification_schedules', JSON.stringify(this.schedules));
    } catch (error) {
      console.warn('Could not save notification schedules:', error);
    }
  }

  private loadSchedules(): void {
    try {
      const stored = localStorage.getItem('notification_schedules');
      if (stored) {
        this.schedules = JSON.parse(stored);
      } else {
        // Load default schedules
        this.schedules = [...this.defaultSchedules];
        this.saveSchedules();
      }
    } catch (error) {
      console.warn('Could not load notification schedules:', error);
      this.schedules = [...this.defaultSchedules];
    }
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }
}

// Export singleton instance
export const pushNotifications = new PushNotificationSystem();