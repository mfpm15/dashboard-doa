import { Item } from '@/types';

export interface ExportData {
  version: string;
  exportedAt: string;
  itemCount: number;
  items: Item[];
  metadata?: {
    appName: string;
    appVersion: string;
    format: string;
  };
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'txt';
  includeDeleted?: boolean;
  selectedCategories?: string[];
  selectedTags?: string[];
}

/**
 * Export items to JSON format
 */
export function exportToJSON(items: Item[], options: Partial<ExportOptions> = {}): string {
  const exportData: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    itemCount: items.length,
    items: items,
    metadata: {
      appName: 'Dashboard Doa',
      appVersion: '1.0.0',
      format: 'json'
    }
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export items to CSV format
 */
export function exportToCSV(items: Item[]): string {
  const headers = [
    'id',
    'title',
    'arabic',
    'latin',
    'translation_id',
    'category',
    'tags',
    'source',
    'favorite',
    'createdAt',
    'updatedAt'
  ];

  const csvRows = [
    headers.join(','),
    ...items.map(item => [
      `"${item.id}"`,
      `"${item.title?.replace(/"/g, '""') || ''}"`,
      `"${item.arabic?.replace(/"/g, '""') || ''}"`,
      `"${item.latin?.replace(/"/g, '""') || ''}"`,
      `"${item.translation_id?.replace(/"/g, '""') || ''}"`,
      `"${item.category?.replace(/"/g, '""') || ''}"`,
      `"${item.tags?.join(';') || ''}"`,
      `"${item.source?.replace(/"/g, '""') || ''}"`,
      item.favorite ? 'true' : 'false',
      new Date(item.createdAt).toISOString(),
      new Date(item.updatedAt).toISOString()
    ].join(','))
  ];

  return csvRows.join('\n');
}

/**
 * Export items to readable text format
 */
export function exportToTXT(items: Item[]): string {
  const sections = items.map(item => {
    const parts = [
      `=== ${item.title} ===`,
      item.category ? `Kategori: ${item.category}` : '',
      item.tags?.length ? `Tags: ${item.tags.join(', ')}` : '',
      '',
      item.arabic ? `Arab:\n${item.arabic}` : '',
      '',
      item.latin ? `Latin:\n${item.latin}` : '',
      '',
      item.translation_id ? `Terjemahan:\n${item.translation_id}` : '',
      '',
      item.source ? `Sumber: ${item.source}` : '',
      item.favorite ? 'Status: ⭐ Favorit' : '',
      `Dibuat: ${new Date(item.createdAt).toLocaleDateString('id-ID')}`,
      `Diperbarui: ${new Date(item.updatedAt).toLocaleDateString('id-ID')}`,
      ''
    ];

    return parts.filter(Boolean).join('\n');
  });

  const header = [
    '🤲 Dashboard Doa - Export Data',
    `Total Doa: ${items.length}`,
    `Export pada: ${new Date().toLocaleString('id-ID')}`,
    ''.padEnd(50, '='),
    ''
  ].join('\n');

  return header + sections.join('\n' + ''.padEnd(50, '-') + '\n\n');
}

/**
 * Download export data as file
 */
export function downloadExport(data: string, filename: string, mimeType: string): void {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 */
export function generateExportFilename(format: string, prefix = 'dashboard-doa'): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  return `${prefix}-${timestamp}.${format}`;
}

/**
 * Get MIME type for export format
 */
export function getExportMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    json: 'application/json',
    csv: 'text/csv',
    txt: 'text/plain'
  };

  return mimeTypes[format] || 'text/plain';
}

/**
 * Main export function with format selection
 */
export function exportItems(items: Item[], options: ExportOptions): void {
  let data: string;
  let extension: string;

  switch (options.format) {
    case 'json':
      data = exportToJSON(items, options);
      extension = 'json';
      break;
    case 'csv':
      data = exportToCSV(items);
      extension = 'csv';
      break;
    case 'txt':
      data = exportToTXT(items);
      extension = 'txt';
      break;
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }

  const filename = generateExportFilename(extension);
  const mimeType = getExportMimeType(extension);

  downloadExport(data, filename, mimeType);
}