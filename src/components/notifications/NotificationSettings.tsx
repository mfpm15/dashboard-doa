'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { pushNotifications, NotificationSettings as Settings, NotificationSchedule } from '@/lib/notifications/pushNotifications';

interface NotificationSettingsProps {
  onClose?: () => void;
  className?: string;
}

export function NotificationSettings({ onClose, className = "" }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [schedules, setSchedules] = useState<NotificationSchedule[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSupported(pushNotifications.isSupported());
    setPermission(pushNotifications.getPermissionStatus());
    setSettings(pushNotifications.getSettings());
    setSchedules(pushNotifications.getSchedules());
  }, []);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    const success = await pushNotifications.enableNotifications();
    if (success) {
      setPermission('granted');
      setSettings(pushNotifications.getSettings());
    }
    setIsLoading(false);
  };

  const handleDisableNotifications = () => {
    pushNotifications.disableNotifications();
    setSettings(pushNotifications.getSettings());
  };

  const handleSettingsUpdate = (newSettings: Partial<Settings>) => {
    if (!settings) return;
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    pushNotifications.updateSettings(newSettings);
  };

  const handleScheduleToggle = (scheduleId: string, enabled: boolean) => {
    pushNotifications.updateSchedule(scheduleId, { enabled });
    setSchedules(pushNotifications.getSchedules());
  };

  const handleScheduleTimeUpdate = (scheduleId: string, time: string) => {
    pushNotifications.updateSchedule(scheduleId, { time });
    setSchedules(pushNotifications.getSchedules());
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'prayer': return 'book-open';
      case 'dhikr': return 'repeat';
      case 'achievement': return 'award';
      case 'reminder': return 'bell';
      default: return 'bell';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'prayer': return 'Doa';
      case 'dhikr': return 'Dzikir';
      case 'achievement': return 'Pencapaian';
      case 'reminder': return 'Pengingat';
      default: return 'Notifikasi';
    }
  };

  if (!isSupported) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 ${className}`}>
        <div className="text-center">
          <Icon name="bell-off" size={48} className="mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Notifikasi Tidak Didukung
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Browser Anda tidak mendukung push notifications atau service workers.
          </p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Icon name="bell" size={24} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Pengaturan Notifikasi
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <Icon name="x" size={20} />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Permission Status */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon
                name={permission === 'granted' ? 'check-circle' : permission === 'denied' ? 'x-circle' : 'clock'}
                size={20}
                className={permission === 'granted' ? 'text-green-500' : permission === 'denied' ? 'text-red-500' : 'text-yellow-500'}
              />
              <div>
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Status Izin Notifikasi
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {permission === 'granted' ? 'Diizinkan' : permission === 'denied' ? 'Ditolak' : 'Belum Diatur'}
                </p>
              </div>
            </div>

            {permission !== 'granted' && (
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Meminta...' : 'Izinkan'}
              </button>
            )}
          </div>
        </div>

        {/* Main Settings */}
        <div className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Aktifkan Notifikasi
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Terima pengingat doa dan dzikir
              </p>
            </div>
            <button
              onClick={() => settings.enabled ? handleDisableNotifications() : handleEnableNotifications()}
              disabled={permission !== 'granted' || isLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
              } disabled:opacity-50`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Category Settings */}
          {settings.enabled && (
            <>
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Jenis Notifikasi
                </h4>

                {[
                  { key: 'prayerReminders', label: 'Pengingat Doa', icon: 'book-open' },
                  { key: 'dhikrReminders', label: 'Pengingat Dzikir', icon: 'repeat' },
                  { key: 'achievementNotifications', label: 'Notifikasi Pencapaian', icon: 'award' },
                  { key: 'dailyMotivation', label: 'Motivasi Harian', icon: 'heart' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon as any} size={16} className="text-slate-500" />
                      <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                    <button
                      onClick={() => handleSettingsUpdate({ [item.key]: !settings[item.key as keyof Settings] })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        settings[item.key as keyof Settings] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          settings[item.key as keyof Settings] ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sound & Vibration */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Suara & Getaran
                </h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="volume-2" size={16} className="text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-300">Suara Notifikasi</span>
                  </div>
                  <button
                    onClick={() => handleSettingsUpdate({ sound: !settings.sound })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.sound ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.sound ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="smartphone" size={16} className="text-slate-500" />
                    <span className="text-slate-700 dark:text-slate-300">Getaran</span>
                  </div>
                  <button
                    onClick={() => handleSettingsUpdate({ vibrate: !settings.vibrate })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.vibrate ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.vibrate ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Jam Tenang
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Aktifkan Jam Tenang</span>
                  <button
                    onClick={() => handleSettingsUpdate({
                      quietHours: { ...settings.quietHours, enabled: !settings.quietHours.enabled }
                    })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.quietHours.enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.quietHours.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Mulai
                      </label>
                      <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => handleSettingsUpdate({
                          quietHours: { ...settings.quietHours, start: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Selesai
                      </label>
                      <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => handleSettingsUpdate({
                          quietHours: { ...settings.quietHours, end: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Schedules */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    Jadwal Notifikasi
                  </h4>
                  <button
                    onClick={() => setShowAddSchedule(true)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Tambah
                  </button>
                </div>

                <div className="space-y-2">
                  {schedules.map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon
                          name={getCategoryIcon(schedule.category)}
                          size={16}
                          className="text-slate-500"
                        />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {schedule.title}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {formatTime(schedule.time)} • {getCategoryLabel(schedule.category)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleScheduleToggle(schedule.id, !schedule.enabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          schedule.enabled ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            schedule.enabled ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}