'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileText, Database, FileSpreadsheet, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Item } from '@/types';
import { exportItems, ExportOptions } from '@/lib/export';
import { importData, ImportResult, ImportOptions } from '@/lib/import';
import { addItem, loadItems } from '@/lib/storage';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onImportComplete?: () => void;
}

type TabType = 'export' | 'import';

export function ExportImportModal({
  isOpen,
  onClose,
  items,
  onImportComplete
}: ExportImportModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'txt'>('json');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const options: ExportOptions = {
        format: exportFormat,
        includeDeleted: false
      };

      exportItems(items, options);

      // Show success message (you could add a toast here)
      console.log(`Exported ${items.length} items in ${exportFormat} format`);
    } catch (error) {
      console.error('Export failed:', error);
      // Show error message
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const fileContent = await readFileContent(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      const options: ImportOptions = {
        overwriteExisting: false,
        skipDuplicates: true,
        validateContent: true
      };

      const result = importData(fileContent, fileExtension, options);
      setImportResult(result);

      if (result.success && result.items.length > 0) {
        // Import items to storage
        const existingItems = loadItems();
        const existingIds = new Set(existingItems.map(item => item.id));
        const existingTitles = new Set(existingItems.map(item => item.title.toLowerCase()));

        let actualImported = 0;
        let actualSkipped = 0;

        for (const item of result.items) {
          const hasConflict = existingIds.has(item.id) ||
                            existingTitles.has(item.title.toLowerCase());

          if (!hasConflict) {
            addItem(item);
            actualImported++;
          } else {
            actualSkipped++;
          }
        }

        // Update result with actual numbers
        setImportResult(prev => prev ? {
          ...prev,
          importedCount: actualImported,
          skippedCount: actualSkipped,
          message: `Import selesai. ${actualImported} item ditambahkan, ${actualSkipped} duplikat dilewati.`
        } : null);

        if (actualImported > 0 && onImportComplete) {
          onImportComplete();
        }
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: `Error membaca file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        importedCount: 0,
        skippedCount: 0,
        errorCount: 1,
        items: []
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const formatOptions = [
    { value: 'json', label: 'JSON', desc: 'Format terstruktur dengan metadata lengkap', icon: Database },
    { value: 'csv', label: 'CSV', desc: 'Format spreadsheet untuk Excel/Google Sheets', icon: FileSpreadsheet },
    { value: 'txt', label: 'TXT', desc: 'Format teks readable untuk backup', icon: FileText }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Export & Import Data
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Download size={16} className="inline mr-2" />
              Export
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'import'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload size={16} className="inline mr-2" />
              Import
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'export' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Export Data Doa
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Export {items.length} doa dalam koleksi Anda ke file untuk backup atau sharing.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Pilih Format Export:
                </label>
                <div className="space-y-3">
                  {formatOptions.map((format) => {
                    const Icon = format.icon;
                    return (
                      <label
                        key={format.value}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                          exportFormat === format.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="exportFormat"
                          value={format.value}
                          checked={exportFormat === format.value}
                          onChange={(e) => setExportFormat(e.target.value as any)}
                          className="sr-only"
                        />
                        <Icon size={20} className="text-slate-500 dark:text-slate-400 mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {format.label}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {format.desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-start">
                  <Info size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Tips:</strong> File JSON berisi metadata lengkap dan bisa di-import kembali dengan sempurna.
                    CSV cocok untuk diedit di Excel. TXT cocok untuk dibaca manusia.
                  </div>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Download size={20} className="mr-2" />
                Export {items.length} Doa sebagai {exportFormat.toUpperCase()}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Import Data Doa
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Import doa dari file JSON atau CSV untuk menambah koleksi Anda.
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <Upload size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Pilih file JSON atau CSV untuk diimport
                </p>
                <button
                  onClick={handleImportClick}
                  disabled={isImporting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  {isImporting ? 'Memproses...' : 'Pilih File'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {importResult && (
                <div className={`p-4 rounded-lg ${
                  importResult.success
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                }`}>
                  <div className="flex items-start">
                    {importResult.success ? (
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        importResult.success
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {importResult.success ? 'Import Berhasil!' : 'Import Gagal'}
                      </p>
                      <p className={`text-sm mt-1 ${
                        importResult.success
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {importResult.message}
                      </p>
                      {importResult.success && (
                        <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                          • {importResult.importedCount} item berhasil ditambahkan<br/>
                          • {importResult.skippedCount} item dilewati (duplikat)<br/>
                          • {importResult.errorCount} item error
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-start">
                  <Info size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Catatan:</strong> Import akan melewati item yang sudah ada (duplikat berdasarkan judul).
                    Format yang didukung: JSON (dari export aplikasi ini), CSV dengan header standar.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}