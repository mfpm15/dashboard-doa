'use client';

import React, { useState, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import { toast } from '@/components/ui/Toast';
import {
  downloadExport,
  downloadCSV,
  downloadText,
  importFromFile,
  validateImportData
} from '@/lib/importExport';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

export function ImportExportModal({ isOpen, onClose, onImportComplete }: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async (format: 'json' | 'csv' | 'text') => {
    setIsProcessing(true);
    try {
      let success = false;

      switch (format) {
        case 'json':
          success = downloadExport();
          break;
        case 'csv':
          success = downloadCSV();
          break;
        case 'text':
          success = downloadText();
          break;
      }

      if (success) {
        toast.success(`Data berhasil diekspor dalam format ${format.toUpperCase()}`);
      } else {
        toast.error('Gagal mengekspor data');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Terjadi kesalahan saat mengekspor data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Hanya file JSON yang didukung untuk import');
      return;
    }

    setIsProcessing(true);
    setImportResult(null);

    try {
      const result = await importFromFile(file);
      setImportResult(result);

      if (result.success) {
        toast.success(`Berhasil mengimpor ${result.imported} item`);
        onImportComplete?.();
      } else {
        toast.error('Import gagal, periksa detail error');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Gagal membaca file');
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-4xl mx-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Import & Export Data
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Backup dan restore data doa Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon name="download" size={16} className="inline mr-2" />
            Export
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Icon name="upload" size={16} className="inline mr-2" />
            Import
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Icon name="download" size={48} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Export Data Anda
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Simpan semua data doa dan zikir dalam berbagai format
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* JSON Export */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name="file-text" className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      JSON Backup
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Format lengkap dengan metadata, audio, dan trash. Ideal untuk backup dan restore.
                    </p>
                    <button
                      onClick={() => handleExport('json')}
                      disabled={isProcessing}
                      className="w-full btn btn-primary"
                    >
                      {isProcessing ? (
                        <Icon name="refresh" size={16} className="animate-spin mr-2" />
                      ) : (
                        <Icon name="download" size={16} className="mr-2" />
                      )}
                      Download JSON
                    </button>
                  </div>
                </div>

                {/* CSV Export */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name="table" className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      CSV Export
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Format tabular untuk analisis data atau import ke aplikasi lain.
                    </p>
                    <button
                      onClick={() => handleExport('csv')}
                      disabled={isProcessing}
                      className="w-full btn btn-secondary"
                    >
                      {isProcessing ? (
                        <Icon name="refresh" size={16} className="animate-spin mr-2" />
                      ) : (
                        <Icon name="download" size={16} className="mr-2" />
                      )}
                      Download CSV
                    </button>
                  </div>
                </div>

                {/* Text Export */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon name="type" className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Text Export
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Format teks plain untuk dibaca manusia atau dicetak.
                    </p>
                    <button
                      onClick={() => handleExport('text')}
                      disabled={isProcessing}
                      className="w-full btn btn-secondary"
                    >
                      {isProcessing ? (
                        <Icon name="refresh" size={16} className="animate-spin mr-2" />
                      ) : (
                        <Icon name="download" size={16} className="mr-2" />
                      )}
                      Download TXT
                    </button>
                  </div>
                </div>
              </div>

              {/* Export Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Tips Export:
                </h5>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Gunakan JSON untuk backup lengkap yang bisa di-restore</li>
                  <li>• CSV cocok untuk analisis data atau import ke Excel</li>
                  <li>• TXT untuk mencetak atau membaca offline</li>
                  <li>• Backup secara rutin untuk keamanan data</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Icon name="upload" size={48} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Import Data
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Restore data dari file backup JSON
                </p>
              </div>

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-primary-400 dark:hover:border-primary-600 transition-colors cursor-pointer"
                onClick={triggerFileSelect}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Icon name="upload-cloud" size={48} className="mx-auto text-slate-400 mb-4" />
                <h4 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Pilih File Backup
                </h4>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Klik untuk memilih file JSON backup atau drag & drop di sini
                </p>
                <button
                  onClick={triggerFileSelect}
                  disabled={isProcessing}
                  className="btn btn-primary"
                >
                  {isProcessing ? (
                    <Icon name="refresh" size={16} className="animate-spin mr-2" />
                  ) : (
                    <Icon name="upload" size={16} className="mr-2" />
                  )}
                  {isProcessing ? 'Mengimpor...' : 'Pilih File'}
                </button>
              </div>

              {/* Import Result */}
              {importResult && (
                <div className={`border rounded-lg p-4 ${
                  importResult.success
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <Icon
                      name={importResult.success ? "check-circle" : "alert-circle"}
                      className={importResult.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}
                      size={20}
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium mb-2 ${
                        importResult.success
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        {importResult.success ? 'Import Berhasil!' : 'Import Gagal'}
                      </h4>

                      {importResult.success && (
                        <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                          <p>Berhasil mengimpor {importResult.imported} item</p>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>Items: {importResult.summary.items}</div>
                            <div>Trash: {importResult.summary.trash}</div>
                            <div>Categories: {importResult.summary.categories}</div>
                            <div>Tags: {importResult.summary.tags}</div>
                          </div>
                        </div>
                      )}

                      {importResult.errors.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Errors ({importResult.errors.length}):
                          </p>
                          <div className="max-h-32 overflow-y-auto text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            {importResult.errors.map((error: string, index: number) => (
                              <div key={index} className="font-mono bg-white dark:bg-slate-800 p-2 rounded">
                                {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Import Tips */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  Perhatian Import:
                </h5>
                <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  <li>• Data yang diimpor akan ditambahkan ke data yang sudah ada</li>
                  <li>• Pastikan file backup dalam format JSON yang valid</li>
                  <li>• Proses import mungkin memakan waktu untuk file besar</li>
                  <li>• Backup data saat ini sebelum melakukan import</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}