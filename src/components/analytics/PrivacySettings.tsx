'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { analytics } from '@/lib/analytics';
import { toast } from '@/components/ui/Toast';

interface PrivacySettingsProps {
  onClose?: () => void;
  className?: string;
}

interface PrivacyPreferences {
  analyticsEnabled: boolean;
  usageTracking: boolean;
  performanceTracking: boolean;
  crashReporting: boolean;
  dataRetentionDays: number;
  shareUsageStats: boolean;
}

const PRIVACY_PREFS_KEY = 'dashboard_doa_privacy_prefs';

const defaultPreferences: PrivacyPreferences = {
  analyticsEnabled: true,
  usageTracking: true,
  performanceTracking: true,
  crashReporting: true,
  dataRetentionDays: 90,
  shareUsageStats: false
};

export function PrivacySettings({ onClose, className = '' }: PrivacySettingsProps) {
  const [preferences, setPreferences] = useState<PrivacyPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem(PRIVACY_PREFS_KEY);
      if (stored) {
        const prefs = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...prefs });
      }
    } catch (error) {
      console.error('Failed to load privacy preferences:', error);
    }
  };

  const savePreferences = async (newPrefs: PrivacyPreferences) => {
    setIsLoading(true);
    try {
      localStorage.setItem(PRIVACY_PREFS_KEY, JSON.stringify(newPrefs));
      setPreferences(newPrefs);

      // If analytics is disabled, clear existing data
      if (!newPrefs.analyticsEnabled) {
        analytics.clearData();
        toast.success('Data analitik telah dihapus');
      }

      toast.success('Pengaturan privasi berhasil disimpan');
    } catch (error) {
      console.error('Failed to save privacy preferences:', error);
      toast.error('Gagal menyimpan pengaturan privasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof PrivacyPreferences, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  const exportData = () => {
    const data = analytics.exportData();
    const privacyData = {
      ...data,
      privacyPreferences: preferences,
      gdprCompliance: {
        dataController: 'Dashboard Doa App',
        dataProcessingBasis: 'User Consent',
        dataRetentionPolicy: `${preferences.dataRetentionDays} days`,
        userRights: [
          'Right to Access',
          'Right to Rectification',
          'Right to Erasure',
          'Right to Data Portability'
        ]
      }
    };

    const blob = new Blob([JSON.stringify(privacyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-doa-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Data berhasil diekspor');
  };

  const deleteAllData = () => {
    const confirmed = confirm(
      'Apakah Anda yakin ingin menghapus semua data?\n\n' +
      'Ini akan menghapus:\n' +
      '- Semua data analitik dan statistik\n' +
      '- Riwayat penggunaan aplikasi\n' +
      '- Preferensi dan pengaturan\n\n' +
      'Tindakan ini tidak dapat dibatalkan.'
    );

    if (confirmed) {
      // Clear all app data
      localStorage.clear();
      sessionStorage.clear();

      // Clear analytics data
      analytics.clearData();

      toast.success('Semua data telah dihapus');

      // Reload page to reset state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Pengaturan Privasi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola data dan privasi Anda
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="btn-ghost p-2"
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Analytics Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Pengumpulan Data
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  Analitik Penggunaan
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Melacak cara Anda menggunakan aplikasi untuk meningkatkan pengalaman
                </div>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.analyticsEnabled}
                  onChange={(e) => handlePreferenceChange('analyticsEnabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 transition-colors rounded-full ${
                  preferences.analyticsEnabled
                    ? 'bg-primary-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.analyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  Pelacakan Aktivitas
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Mencatat doa yang dibaca dan fitur yang digunakan
                </div>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.usageTracking}
                  onChange={(e) => handlePreferenceChange('usageTracking', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 transition-colors rounded-full ${
                  preferences.usageTracking
                    ? 'bg-primary-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.usageTracking ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  Laporan Performa
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Membantu mengidentifikasi dan memperbaiki masalah performa
                </div>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.performanceTracking}
                  onChange={(e) => handlePreferenceChange('performanceTracking', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 transition-colors rounded-full ${
                  preferences.performanceTracking
                    ? 'bg-primary-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.performanceTracking ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  Laporan Crash
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Otomatis melaporkan error untuk perbaikan aplikasi
                </div>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.crashReporting}
                  onChange={(e) => handlePreferenceChange('crashReporting', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 transition-colors rounded-full ${
                  preferences.crashReporting
                    ? 'bg-primary-500'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.crashReporting ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Penyimpanan Data
          </h3>

          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              Lama Penyimpanan Data
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Berapa lama data analitik disimpan sebelum dihapus otomatis
            </div>
            <select
              value={preferences.dataRetentionDays}
              onChange={(e) => handlePreferenceChange('dataRetentionDays', parseInt(e.target.value))}
              className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg"
            >
              <option value={30}>30 hari</option>
              <option value={60}>60 hari</option>
              <option value={90}>90 hari</option>
              <option value={180}>6 bulan</option>
              <option value={365}>1 tahun</option>
            </select>
          </div>
        </div>

        {/* Data Rights */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Hak Data Anda
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={exportData}
              className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Icon name="download" size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Ekspor Data
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Unduh semua data Anda
                </div>
              </div>
            </button>

            <button
              onClick={deleteAllData}
              className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                <Icon name="trash" size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <div className="font-medium text-red-900 dark:text-red-100">
                  Hapus Semua Data
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Hapus semua data permanen
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="info" size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <div className="font-medium mb-1">Komitmen Privasi</div>
              <p>
                Dashboard Doa menghormati privasi Anda. Semua data disimpan secara lokal di perangkat Anda
                dan tidak dikirim ke server eksternal kecuali fitur sinkronisasi diaktifkan.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Menyimpan...
              </>
            ) : (
              <>
                <Icon name="save" size={16} />
                Simpan Pengaturan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}