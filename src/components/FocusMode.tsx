'use client';

import { useState, useEffect } from 'react';
import { Icon } from './ui/Icon';
import { Item } from '@/types';

interface FocusModeProps {
  isActive: boolean;
  onToggle: () => void;
  items: Item[];
  selectedItem?: Item | null;
  onItemSelect?: (item: Item) => void;
}

export function FocusMode({ isActive, onToggle, items, selectedItem, onItemSelect }: FocusModeProps) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState(15); // minutes
  const [showBreakReminder, setShowBreakReminder] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;

          // Check if target time reached
          if (newTime >= targetTime * 60) {
            setIsRunning(false);
            setShowBreakReminder(true);

            // Show notification if permitted
            if (Notification.permission === 'granted') {
              new Notification('🕐 Waktu Fokus Selesai', {
                body: `Anda telah fokus selama ${targetTime} menit. Saatnya istirahat!`,
                icon: '/icons/icon-192x192.png'
              });
            }
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isActive, targetTime]);

  useEffect(() => {
    if (isActive) {
      // Hide distracting elements
      document.body.classList.add('focus-mode');

      // Prevent accidental navigation
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (isRunning) {
          e.preventDefault();
          e.returnValue = 'Anda sedang dalam focus mode. Yakin ingin keluar?';
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.body.classList.remove('focus-mode');
      };
    }
  }, [isActive, isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setShowBreakReminder(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimer(0);
    setShowBreakReminder(false);
  };

  const handleTargetChange = (minutes: number) => {
    setTargetTime(minutes);
    if (timer >= minutes * 60) {
      setTimer(0);
    }
  };

  if (!isActive) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
        title="Aktifkan Focus Mode"
      >
        <Icon name="eye" className="w-4 h-4" />
        <span className="hidden sm:inline">Focus</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="eye" className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Focus Mode
            </h2>
          </div>

          {/* Timer Display */}
          <div className="flex items-center gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
              {formatTime(timer)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              / {targetTime} min
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Icon name="x" className="w-4 h-4" />
          <span>Keluar Focus</span>
        </button>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Target Time Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Target:</span>
          <select
            value={targetTime}
            onChange={(e) => handleTargetChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
            disabled={isRunning}
          >
            <option value={5}>5 menit</option>
            <option value={10}>10 menit</option>
            <option value={15}>15 menit</option>
            <option value={25}>25 menit</option>
            <option value={30}>30 menit</option>
            <option value={45}>45 menit</option>
            <option value={60}>60 menit</option>
          </select>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Icon name="play" className="w-4 h-4" />
              Mulai
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Icon name="pause" className="w-4 h-4" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Icon name="refresh" className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, (timer / (targetTime * 60)) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {showBreakReminder ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Selamat! Focus session selesai
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Anda telah fokus selama {targetTime} menit. Saatnya istirahat sejenak.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Mulai Session Baru
              </button>
              <button
                onClick={onToggle}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Keluar Focus Mode
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Prayer Display */}
            {selectedItem ? (
              <div className="space-y-8 text-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedItem.title}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                    <Icon name="tag" className="w-3 h-3" />
                    {selectedItem.category}
                  </div>
                </div>

                {/* Arabic Text */}
                {selectedItem.arabic && (
                  <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="arabic text-right leading-loose text-gray-900 dark:text-white">
                      {selectedItem.arabic}
                    </div>
                  </div>
                )}

                {/* Latin Text */}
                {selectedItem.latin && (
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="latin text-blue-800 dark:text-blue-200 text-lg leading-relaxed">
                      {selectedItem.latin}
                    </p>
                  </div>
                )}

                {/* Translation */}
                {selectedItem.translation_id && (
                  <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-green-800 dark:text-green-200 text-lg leading-relaxed">
                      {selectedItem.translation_id}
                    </p>
                  </div>
                )}

                {/* Source */}
                {selectedItem.source && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Sumber:</strong> {selectedItem.source}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🧘‍♂️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Mode Fokus Aktif
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Pilih doa dari daftar untuk memulai bacaan fokus
                </p>

                {/* Show available prayers */}
                {items.length > 0 && (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Doa-doa tersedia:
                    </h4>
                    <div className="grid gap-3">
                      {items.slice(0, 10).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onItemSelect?.(item)}
                          className="p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left transition-colors"
                        >
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.category}
                          </p>
                        </button>
                      ))}
                      {items.length > 10 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          dan {items.length - 10} doa lainnya...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Focus Tips */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Tips Focus Mode:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <Icon name="check" className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Siapkan niat yang baik sebelum memulai</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="check" className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Baca dengan tenang dan penuh makna</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="check" className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Renungkan makna setiap doa yang dibaca</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}