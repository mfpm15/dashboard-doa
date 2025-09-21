'use client';

import { useState, useEffect } from 'react';
import { Icon } from './ui/Icon';
import { showToast } from './ui/Toast';
import { notificationManager } from '@/lib/notifications';

export function NotificationSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState({ hour: 7, minute: 0 });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check current notification status
    setIsEnabled(notificationManager.isEnabled());

    // Load reminder settings
    const settings = notificationManager.getReminderSettings();
    if (settings) {
      setReminderTime({ hour: settings.hour, minute: settings.minute });
    }
  }, []);

  const handleEnableNotifications = async () => {
    try {
      await notificationManager.initialize();
      const permission = await notificationManager.requestPermission();

      if (permission === 'granted') {
        setIsEnabled(true);
        await notificationManager.scheduleDailyReminder(reminderTime.hour, reminderTime.minute);
        showToast({ message: 'Notifikasi berhasil diaktifkan!', type: 'success' });
      } else {
        showToast({ message: 'Izin notifikasi ditolak', type: 'error' });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      showToast({ message: 'Gagal mengaktifkan notifikasi', type: 'error' });
    }
  };

  const handleDisableNotifications = () => {
    notificationManager.disableReminder();
    setIsEnabled(false);
    showToast({ message: 'Notifikasi dinonaktifkan', type: 'success' });
  };

  const handleTimeChange = async (newHour: number, newMinute: number) => {
    setReminderTime({ hour: newHour, minute: newMinute });

    if (isEnabled) {
      await notificationManager.scheduleDailyReminder(newHour, newMinute);
      showToast({ message: 'Waktu pengingat diperbarui', type: 'success' });
    }
  };

  const testNotification = async () => {
    const success = await notificationManager.showNotification({
      title: '🤲 Test Notifikasi',
      body: 'Notifikasi berfungsi dengan baik!',
      tag: 'test'
    });

    if (success) {
      showToast({ message: 'Notifikasi test dikirim', type: 'success' });
    } else {
      showToast({ message: 'Gagal mengirim test notifikasi', type: 'error' });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="clock" className="w-5 h-5 text-primary-600" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Pengingat Doa
          </h3>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <Icon name={showSettings ? "chevron-up" : "chevron-down"} className="w-4 h-4" />
        </button>
      </div>

      {showSettings && (
        <div className="space-y-4">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Aktifkan pengingat harian
            </span>

            <button
              onClick={isEnabled ? handleDisableNotifications : handleEnableNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled
                  ? 'bg-primary-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Time Picker */}
          {isEnabled && (
            <div className="space-y-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Waktu pengingat:
              </label>

              <div className="flex items-center gap-2">
                <select
                  value={reminderTime.hour}
                  onChange={(e) => handleTimeChange(parseInt(e.target.value), reminderTime.minute)}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>

                <span className="text-gray-500">:</span>

                <select
                  value={reminderTime.minute}
                  onChange={(e) => handleTimeChange(reminderTime.hour, parseInt(e.target.value))}
                  className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Test Button */}
          {isEnabled && (
            <button
              onClick={testNotification}
              className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Icon name="play" className="w-4 h-4" />
              Test Notifikasi
            </button>
          )}

          {/* Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-md p-2">
            <Icon name="info" className="w-3 h-3 inline mr-1" />
            Notifikasi akan mengingatkan Anda untuk membaca doa setiap hari pada waktu yang ditentukan.
          </div>
        </div>
      )}

    </div>
  );
}