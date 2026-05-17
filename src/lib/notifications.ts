/**
 * Prayer Reminder & Notification System
 * Uses the Web Notifications API + localStorage scheduling
 */

export interface ReminderSchedule {
  id: string;
  label: string;
  time: string; // HH:mm format
  enabled: boolean;
  days: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  sound: boolean;
}

export interface NotificationPrefs {
  enabled: boolean;
  reminders: ReminderSchedule[];
  lastNotifiedAt?: number;
}

const STORAGE_KEY = 'app:notification-prefs:v1';

export const DEFAULT_REMINDERS: ReminderSchedule[] = [
  {
    id: 'fajr',
    label: 'Dzikir Pagi (Ba\'da Subuh)',
    time: '05:30',
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: true,
  },
  {
    id: 'dhuhr',
    label: 'Doa Siang (Ba\'da Dzuhur)',
    time: '12:30',
    enabled: false,
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: true,
  },
  {
    id: 'asr',
    label: 'Dzikir Sore (Ba\'da Ashar)',
    time: '15:30',
    enabled: false,
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: true,
  },
  {
    id: 'maghrib',
    label: 'Dzikir Petang (Ba\'da Maghrib)',
    time: '18:30',
    enabled: true,
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: true,
  },
  {
    id: 'isha',
    label: 'Doa Malam (Ba\'da Isya)',
    time: '20:00',
    enabled: false,
    days: [0, 1, 2, 3, 4, 5, 6],
    sound: true,
  },
];

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  enabled: false,
  reminders: DEFAULT_REMINDERS,
};

// Load notification preferences
export function loadNotificationPrefs(): NotificationPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return DEFAULT_NOTIFICATION_PREFS;
}

// Save notification preferences
export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  return await Notification.requestPermission();
}

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

// Get current permission status
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

// Show a notification
export function showNotification(title: string, body: string, tag?: string): void {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: tag || 'prayer-reminder',
    requireInteraction: false,
    silent: false,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto-close after 10 seconds
  setTimeout(() => notification.close(), 10000);
}

// Check if a reminder should fire now
export function shouldFireReminder(reminder: ReminderSchedule): boolean {
  if (!reminder.enabled) return false;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return reminder.days.includes(currentDay) && reminder.time === currentTime;
}

// Get motivational message for notification
export function getMotivationalMessage(): string {
  const messages = [
    'Waktunya mendekatkan diri kepada Allah 🤲',
    'Jangan lupa dzikir hari ini, Allah selalu dekat 💚',
    'Sebaik-baik doa adalah yang dilakukan dengan istiqamah 📿',
    'Allah mencintai hamba yang senantiasa berdoa kepada-Nya 🌙',
    'Doa adalah senjata orang beriman ⚡',
    'Luangkan waktu sejenak untuk bermunajat kepada-Nya 🕌',
    'Ingatlah Allah, niscaya Dia akan mengingatmu 💫',
    'Berdoalah dengan yakin, Allah Maha Mendengar 🎯',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Timer check interval ID
let checkIntervalId: ReturnType<typeof setInterval> | null = null;

// Start the reminder checker (runs every minute)
export function startReminderChecker(): void {
  if (checkIntervalId) return; // Already running

  checkIntervalId = setInterval(() => {
    const prefs = loadNotificationPrefs();
    if (!prefs.enabled) return;

    for (const reminder of prefs.reminders) {
      if (shouldFireReminder(reminder)) {
        showNotification(
          `📿 ${reminder.label}`,
          getMotivationalMessage(),
          reminder.id
        );
        // Update last notified
        prefs.lastNotifiedAt = Date.now();
        saveNotificationPrefs(prefs);
      }
    }
  }, 60000); // Check every minute
}

// Stop the reminder checker
export function stopReminderChecker(): void {
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
}
