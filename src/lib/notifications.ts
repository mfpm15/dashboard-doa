/**
 * Push Notifications System for Dashboard Doa
 * Handles notification permissions, registration, and scheduling
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class NotificationManager {
  private static instance: NotificationManager;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async initialize(): Promise<boolean> {
    // Check if notifications are supported
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered for notifications');
      return true;
    } catch (error) {
      console.error('Failed to register service worker:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission;
  }

  async showNotification(options: NotificationOptions): Promise<boolean> {
    const permission = await this.requestPermission();

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    try {
      if (this.registration) {
        // Use service worker for better reliability
        await this.registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          badge: options.badge || '/icons/icon-72x72.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction || false,
          data: {
            url: window.location.origin,
            timestamp: Date.now()
          }
        });
      } else {
        // Fallback to basic notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png'
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  // Schedule daily prayer reminder
  async scheduleDailyReminder(hour: number = 7, minute: number = 0): Promise<boolean> {
    const permission = await this.requestPermission();
    if (permission !== 'granted') return false;

    // Store reminder schedule in localStorage
    const reminder = {
      hour,
      minute,
      enabled: true,
      lastNotified: null
    };

    localStorage.setItem('prayer-reminder', JSON.stringify(reminder));

    // Start checking for reminder time
    this.startReminderCheck();
    return true;
  }

  private startReminderCheck(): void {
    // Check every minute for reminder time
    setInterval(() => {
      const reminderData = localStorage.getItem('prayer-reminder');
      if (!reminderData) return;

      const reminder = JSON.parse(reminderData);
      if (!reminder.enabled) return;

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Check if it's time for reminder
      if (currentHour === reminder.hour && currentMinute === reminder.minute) {
        const today = now.toDateString();

        // Prevent multiple notifications on the same day
        if (reminder.lastNotified !== today) {
          this.showNotification({
            title: '🤲 Waktu Membaca Doa',
            body: 'Jangan lupa membaca doa hari ini. Semoga berkah!',
            tag: 'daily-reminder',
            requireInteraction: true,
            actions: [
              {
                action: 'open',
                title: 'Buka Aplikasi'
              },
              {
                action: 'dismiss',
                title: 'Nanti'
              }
            ]
          });

          // Update last notified
          reminder.lastNotified = today;
          localStorage.setItem('prayer-reminder', JSON.stringify(reminder));
        }
      }
    }, 60000); // Check every minute
  }

  // Prayer completion notification
  async notifyPrayerCompletion(prayerTitle: string): Promise<void> {
    await this.showNotification({
      title: '✅ Doa Selesai',
      body: `Alhamdulillah, Anda telah menyelesaikan "${prayerTitle}"`,
      tag: 'prayer-completed',
      actions: [
        {
          action: 'next',
          title: 'Doa Selanjutnya'
        },
        {
          action: 'close',
          title: 'Selesai'
        }
      ]
    });
  }

  // Achievement notification
  async notifyAchievement(achievement: string): Promise<void> {
    await this.showNotification({
      title: '🏆 Pencapaian Baru!',
      body: achievement,
      tag: 'achievement',
      requireInteraction: true
    });
  }

  // Disable reminder
  disableReminder(): void {
    const reminderData = localStorage.getItem('prayer-reminder');
    if (reminderData) {
      const reminder = JSON.parse(reminderData);
      reminder.enabled = false;
      localStorage.setItem('prayer-reminder', JSON.stringify(reminder));
    }
  }

  // Check if notifications are enabled
  isEnabled(): boolean {
    return Notification.permission === 'granted';
  }

  // Get reminder settings
  getReminderSettings(): { hour: number; minute: number; enabled: boolean } | null {
    const reminderData = localStorage.getItem('prayer-reminder');
    return reminderData ? JSON.parse(reminderData) : null;
  }
}

// Export singleton instance
export const notificationManager = NotificationManager.getInstance();