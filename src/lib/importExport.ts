import { Item, TrashItem } from '@/types';
import { loadItems, loadTrash } from '@/lib/storage';

// Export data to JSON
export function exportToJSON(): string {
  const items = loadItems();
  const trash = loadTrash();

  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    totalItems: items.length,
    totalTrash: trash.length,
    data: {
      items,
      trash
    },
    metadata: {
      categories: Array.from(new Set(items.map(item => item.category))),
      tags: Array.from(new Set(items.flatMap(item => item.tags || []))),
      withAudio: items.filter(item => item.audio && item.audio.length > 0).length,
      favorites: items.filter(item => item.favorite).length
    }
  };

  return JSON.stringify(exportData, null, 2);
}

// Export data and download as file
export function downloadExport() {
  try {
    const jsonData = exportToJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-doa-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

// Import data from JSON string
export function importFromJSON(jsonData: string): {
  success: boolean;
  imported: number;
  errors: string[];
  summary: {
    items: number;
    trash: number;
    categories: number;
    tags: number;
  };
} {
  const errors: string[] = [];
  let imported = 0;

  try {
    const data = JSON.parse(jsonData);

    // Validate format
    if (!data.version || !data.data) {
      throw new Error('Invalid backup file format');
    }

    // Import items
    if (data.data.items && Array.isArray(data.data.items)) {
      data.data.items.forEach((item: any, index: number) => {
        try {
          // Validate required fields
          if (!item.title || !item.category) {
            errors.push(`Item ${index + 1}: Missing required fields`);
            return;
          }

          // Import item using storage function
          const { addItem } = require('@/lib/storage');
          addItem({
            title: item.title,
            category: item.category,
            arabic: item.arabic || '',
            latin: item.latin || '',
            translation_id: item.translation_id || '',
            source: item.source || '',
            tags: item.tags || [],
            favorite: Boolean(item.favorite),
            audio: item.audio || []
          });

          imported++;
        } catch (error) {
          errors.push(`Item ${index + 1}: ${(error as Error).message}`);
        }
      });
    }

    // Import trash (if exists)
    if (data.data.trash && Array.isArray(data.data.trash)) {
      data.data.trash.forEach((trashItem: any, index: number) => {
        try {
          if (!trashItem.item || !trashItem.deletedAt) {
            errors.push(`Trash item ${index + 1}: Invalid format`);
            return;
          }

          // Add to trash using storage function
          const { addToTrash } = require('@/lib/storage');
          addToTrash(trashItem.item, trashItem.deletedAt);
        } catch (error) {
          errors.push(`Trash item ${index + 1}: ${(error as Error).message}`);
        }
      });
    }

    return {
      success: true,
      imported,
      errors,
      summary: {
        items: data.data.items?.length || 0,
        trash: data.data.trash?.length || 0,
        categories: data.metadata?.categories?.length || 0,
        tags: data.metadata?.tags?.length || 0
      }
    };

  } catch (error) {
    return {
      success: false,
      imported: 0,
      errors: [`Parse error: ${(error as Error).message}`],
      summary: { items: 0, trash: 0, categories: 0, tags: 0 }
    };
  }
}

// Import from file upload
export function importFromFile(file: File): Promise<{
  success: boolean;
  imported: number;
  errors: string[];
  summary: {
    items: number;
    trash: number;
    categories: number;
    tags: number;
  };
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const result = importFromJSON(jsonData);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

// Export to different formats
export function exportToCSV(): string {
  const items = loadItems();

  const headers = ['Title', 'Category', 'Arabic', 'Latin', 'Translation', 'Source', 'Tags', 'Favorite', 'Created Date'];
  const csvData = [headers.join(',')];

  items.forEach(item => {
    const row = [
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.category.replace(/"/g, '""')}"`,
      `"${(item.arabic || '').replace(/"/g, '""')}"`,
      `"${(item.latin || '').replace(/"/g, '""')}"`,
      `"${(item.translation_id || '').replace(/"/g, '""')}"`,
      `"${(item.source || '').replace(/"/g, '""')}"`,
      `"${(item.tags || []).join('; ').replace(/"/g, '""')}"`,
      item.favorite ? 'Yes' : 'No',
      new Date(item.createdAt).toLocaleDateString()
    ];
    csvData.push(row.join(','));
  });

  return csvData.join('\n');
}

export function downloadCSV() {
  try {
    const csvData = exportToCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-doa-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('CSV export failed:', error);
    return false;
  }
}

// Export to plain text format
export function exportToText(): string {
  const items = loadItems();
  const output: string[] = [];

  output.push('='.repeat(50));
  output.push('DASHBOARD DOA - DATA EXPORT');
  output.push('='.repeat(50));
  output.push(`Export Date: ${new Date().toLocaleString()}`);
  output.push(`Total Items: ${items.length}`);
  output.push('');

  items.forEach((item, index) => {
    output.push(`${index + 1}. ${item.title}`);
    output.push(`Category: ${item.category}`);
    output.push('');

    if (item.arabic) {
      output.push('Arabic:');
      output.push(item.arabic);
      output.push('');
    }

    if (item.latin) {
      output.push('Transliteration:');
      output.push(item.latin);
      output.push('');
    }

    if (item.translation_id) {
      output.push('Indonesian Translation:');
      output.push(item.translation_id);
      output.push('');
    }

    if (item.source) {
      output.push(`Source: ${item.source}`);
      output.push('');
    }

    if (item.tags && item.tags.length > 0) {
      output.push(`Tags: ${item.tags.join(', ')}`);
      output.push('');
    }

    output.push('-'.repeat(30));
    output.push('');
  });

  return output.join('\n');
}

export function downloadText() {
  try {
    const textData = exportToText();
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-doa-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Text export failed:', error);
    return false;
  }
}

// Validate import data
export function validateImportData(jsonData: string): {
  valid: boolean;
  version?: string;
  itemCount?: number;
  trashCount?: number;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    const data = JSON.parse(jsonData);

    if (!data.version) {
      errors.push('Missing version information');
    }

    if (!data.data) {
      errors.push('Missing data section');
    }

    if (!data.data.items || !Array.isArray(data.data.items)) {
      errors.push('Invalid or missing items array');
    }

    // Check required fields in items
    if (data.data.items) {
      data.data.items.forEach((item: any, index: number) => {
        if (!item.title) {
          errors.push(`Item ${index + 1}: Missing title`);
        }
        if (!item.category) {
          errors.push(`Item ${index + 1}: Missing category`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      version: data.version,
      itemCount: data.data.items?.length || 0,
      trashCount: data.data.trash?.length || 0,
      errors
    };

  } catch (error) {
    return {
      valid: false,
      errors: [`Invalid JSON: ${(error as Error).message}`]
    };
  }
}