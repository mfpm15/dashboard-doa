'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, Clock, X, AlertCircle } from 'lucide-react';
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  requestNotificationPermission,
  getNotificationPermission,
  startReminderChecker,
  stopReminderChecker,
  NotificationPrefs,
  ReminderSchedule,
} from '@/lib/notifications';

const DAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

interface ReminderSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReminderSettings({ isOpen, onClose }: ReminderSettingsProps) {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [permission, setPermission] = useState<string>('default');

  useEffect(() => {
    if (isOpen) {
      setPrefs(loadNotificationPrefs());
      setPermission(getNotificationPermission() as string);
    }
  }, [isOpen]);

  const handleToggleEnabled = useCallback(async () => {
    if (!prefs) return;

    if (!prefs.enabled) {
      // Enabling - request permission first
      const perm = await requestNotificationPermission();
      setPermission(perm);
      if (perm !== 'granted') return;
    }

    const updated = { ...prefs, enabled: !prefs.enabled };
    setPrefs(updated);
    saveNotificationPrefs(updated);

    if (updated.enabled) {
      startReminderChecker();
    } else {
      stopReminderChecker();
    }
  }, [prefs]);

  const handleToggleReminder = useCallback((id: string) => {
    if (!prefs) return;
    const updated = {
      ...prefs,
      reminders: prefs.reminders.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    };
    setPrefs(updated);
    saveNotificationPrefs(updated);
  }, [prefs]);

  const handleTimeChange = useCallback((id: string, time: string) => {
    if (!prefs) return;
    const updated = {
      ...prefs,
      reminders: prefs.reminders.map((r) =>
        r.id === id ? { ...r, time } : r
      ),
    };
    setPrefs(updated);
    saveNotificationPrefs(updated);
  }, [prefs]);

  const handleToggleDay = useCallback((id: string, day: number) => {
    if (!prefs) return;
    const updated = {
      ...prefs,
      reminders: prefs.reminders.map((r) => {
        if (r.id !== id) return r;
        const days = r.days.includes(day)
          ? r.days.filter((d) => d !== day)
          : [...r.days, day].sort();
        return { ...r, days };
      }),
    };
    setPrefs(updated);
    saveNotificationPrefs(updated);
  }, [prefs]);

  if (!isOpen || !prefs) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pengingat Doa
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Permission warning */}
          {permission === 'denied' && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium">Notifikasi diblokir</p>
                <p className="mt-1">Izinkan notifikasi di pengaturan browser untuk menggunakan fitur pengingat.</p>
              </div>
            </div>
          )}

          {permission === 'unsupported' && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Browser tidak mendukung notifikasi.
              </div>
            </div>
          )}

          {/* Master toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-3">
              {prefs.enabled ? (
                <Bell className="w-5 h-5 text-emerald-500" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Aktifkan Pengingat
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Terima notifikasi pada waktu yang ditentukan
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleEnabled}
              disabled={permission === 'denied' || permission === 'unsupported'}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                prefs.enabled
                  ? 'bg-emerald-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              } ${permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Toggle pengingat"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  prefs.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reminder list */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Jadwal Pengingat
            </h3>

            {prefs.reminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                disabled={!prefs.enabled}
                onToggle={() => handleToggleReminder(reminder.id)}
                onTimeChange={(time) => handleTimeChange(reminder.id, time)}
                onToggleDay={(day) => handleToggleDay(reminder.id, day)}
              />
            ))}
          </div>

          {/* Info */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              💡 Pengingat akan aktif selama tab browser terbuka. Untuk pengingat yang lebih andal, install aplikasi sebagai PWA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual reminder item
function ReminderItem({
  reminder,
  disabled,
  onToggle,
  onTimeChange,
  onToggleDay,
}: {
  reminder: ReminderSchedule;
  disabled: boolean;
  onToggle: () => void;
  onTimeChange: (time: string) => void;
  onToggleDay: (day: number) => void;
}) {
  const isActive = reminder.enabled && !disabled;

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isActive
          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`} />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {reminder.label}
          </span>
        </div>
        <button
          onClick={onToggle}
          disabled={disabled}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            reminder.enabled
              ? 'bg-emerald-500'
              : 'bg-gray-300 dark:bg-gray-600'
          } ${disabled ? 'cursor-not-allowed' : ''}`}
          aria-label={`Toggle ${reminder.label}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              reminder.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {reminder.enabled && (
        <div className="space-y-2 mt-2">
          {/* Time picker */}
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={reminder.time}
              onChange={(e) => onTimeChange(e.target.value)}
              disabled={disabled}
              className="px-2 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Day selector */}
          <div className="flex gap-1">
            {DAYS_SHORT.map((day, index) => (
              <button
                key={day}
                onClick={() => onToggleDay(index)}
                disabled={disabled}
                className={`w-8 h-8 text-xs rounded-full font-medium transition-colors ${
                  reminder.days.includes(index)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                } ${disabled ? 'cursor-not-allowed' : 'hover:opacity-80'}`}
                aria-label={day}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
