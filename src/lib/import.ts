import { Item } from '@/types';
import { ExportData } from './export';

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  items: Item[];
  conflicts?: ImportConflict[];
}

export interface ImportConflict {
  existingItem: Item;
  importedItem: Item;
  conflictType: 'id' | 'title' | 'content';
}

export interface ImportOptions {
  overwriteExisting?: boolean;
  skipDuplicates?: boolean;
  mergeConflicts?: boolean;
  validateContent?: boolean;
}

/**
 * Parse JSON import data
 */
export function parseJSONImport(jsonData: string): ImportResult {
  try {
    const parsed = JSON.parse(jsonData);

    // Check if it's our export format
    if (parsed.version && parsed.items && Array.isArray(parsed.items)) {
      const exportData = parsed as ExportData;
      return {
        success: true,
        message: `Data berhasil diparsing. Ditemukan ${exportData.items.length} item.`,
        importedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        items: exportData.items.map(validateAndNormalizeItem).filter(Boolean) as Item[]
      };
    }

    // Check if it's just an array of items
    if (Array.isArray(parsed)) {
      return {
        success: true,
        message: `Data berhasil diparsing. Ditemukan ${parsed.length} item.`,
        importedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        items: parsed.map(validateAndNormalizeItem).filter(Boolean) as Item[]
      };
    }

    return {
      success: false,
      message: 'Format JSON tidak valid. Expected array of items atau export data.',
      importedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      items: []
    };

  } catch (error) {
    return {
      success: false,
      message: `Error parsing JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      importedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      items: []
    };
  }
}

/**
 * Parse CSV import data
 */
export function parseCSVImport(csvData: string): ImportResult {
  try {
    const lines = csvData.trim().split('\n');

    if (lines.length < 2) {
      return {
        success: false,
        message: 'File CSV kosong atau tidak valid.',
        importedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        items: []
      };
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const items: Item[] = [];
    let errorCount = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const item = createItemFromCSV(headers, values);

        if (item) {
          items.push(item);
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(`Error parsing CSV line ${i + 1}:`, error);
      }
    }

    return {
      success: true,
      message: `CSV berhasil diparsing. ${items.length} item valid, ${errorCount} error.`,
      importedCount: 0,
      skippedCount: 0,
      errorCount,
      items
    };

  } catch (error) {
    return {
      success: false,
      message: `Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      importedCount: 0,
      skippedCount: 0,
      errorCount: 0,
      items: []
    };
  }
}

/**
 * Parse CSV line with proper quote handling
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Create Item from CSV row
 */
function createItemFromCSV(headers: string[], values: string[]): Item | null {
  try {
    const row: Record<string, string> = {};

    for (let i = 0; i < headers.length && i < values.length; i++) {
      row[headers[i]] = values[i].replace(/"/g, '');
    }

    if (!row.title) {
      return null; // Skip rows without title
    }

    const now = Date.now();

    return {
      id: row.id || generateId(),
      title: row.title,
      arabic: row.arabic || undefined,
      latin: row.latin || undefined,
      translation_id: row.translation_id || undefined,
      category: row.category || 'Lainnya',
      tags: row.tags ? row.tags.split(';').map(t => t.trim()).filter(Boolean) : [],
      source: row.source || undefined,
      favorite: row.favorite === 'true',
      createdAt: row.createdAt ? new Date(row.createdAt).getTime() : now,
      updatedAt: row.updatedAt ? new Date(row.updatedAt).getTime() : now
    };
  } catch (error) {
    console.error('Error creating item from CSV:', error);
    return null;
  }
}

/**
 * Validate and normalize imported item
 */
function validateAndNormalizeItem(item: any): Item | null {
  try {
    if (!item || typeof item !== 'object') {
      return null;
    }

    if (!item.title || typeof item.title !== 'string') {
      return null;
    }

    const now = Date.now();

    return {
      id: item.id || generateId(),
      title: String(item.title).trim(),
      arabic: item.arabic ? String(item.arabic).trim() : undefined,
      latin: item.latin ? String(item.latin).trim() : undefined,
      translation_id: item.translation_id ? String(item.translation_id).trim() : undefined,
      category: item.category ? String(item.category).trim() : 'Lainnya',
      tags: Array.isArray(item.tags) ? item.tags.map((t: any) => String(t).trim()).filter(Boolean) : [],
      source: item.source ? String(item.source).trim() : undefined,
      favorite: Boolean(item.favorite),
      createdAt: typeof item.createdAt === 'number' ? item.createdAt : now,
      updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : now
    };
  } catch (error) {
    console.error('Error validating item:', error);
    return null;
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Check for conflicts with existing items
 */
export function checkImportConflicts(importedItems: Item[], existingItems: Item[]): ImportConflict[] {
  const conflicts: ImportConflict[] = [];
  const existingIds = new Set(existingItems.map(item => item.id));
  const existingTitles = new Map(existingItems.map(item => [item.title.toLowerCase(), item]));

  for (const importedItem of importedItems) {
    // Check ID conflicts
    if (existingIds.has(importedItem.id)) {
      const existingItem = existingItems.find(item => item.id === importedItem.id)!;
      conflicts.push({
        existingItem,
        importedItem,
        conflictType: 'id'
      });
    }

    // Check title conflicts
    else if (existingTitles.has(importedItem.title.toLowerCase())) {
      const existingItem = existingTitles.get(importedItem.title.toLowerCase())!;
      conflicts.push({
        existingItem,
        importedItem,
        conflictType: 'title'
      });
    }
  }

  return conflicts;
}

/**
 * Resolve import conflicts based on options
 */
export function resolveImportConflicts(
  importedItems: Item[],
  existingItems: Item[],
  options: ImportOptions
): ImportResult {
  const conflicts = checkImportConflicts(importedItems, existingItems);
  const finalItems: Item[] = [];
  let importedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const conflictIds = new Set(conflicts.map(c => c.importedItem.id));
  const conflictTitles = new Set(conflicts.map(c => c.importedItem.title.toLowerCase()));

  for (const importedItem of importedItems) {
    const hasIdConflict = conflictIds.has(importedItem.id);
    const hasTitleConflict = conflictTitles.has(importedItem.title.toLowerCase());

    if (hasIdConflict || hasTitleConflict) {
      if (options.overwriteExisting) {
        // Generate new ID if needed to avoid conflicts
        if (hasIdConflict) {
          importedItem.id = generateId();
        }
        finalItems.push(importedItem);
        importedCount++;
      } else if (options.skipDuplicates) {
        skippedCount++;
      } else {
        // Default: treat as error
        errorCount++;
      }
    } else {
      finalItems.push(importedItem);
      importedCount++;
    }
  }

  return {
    success: true,
    message: `Import selesai. ${importedCount} item diimport, ${skippedCount} dilewati, ${errorCount} error.`,
    importedCount,
    skippedCount,
    errorCount,
    items: finalItems,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
}

/**
 * Main import function
 */
export function importData(fileContent: string, fileType: string, options: ImportOptions = {}): ImportResult {
  let parseResult: ImportResult;

  // Parse based on file type
  switch (fileType.toLowerCase()) {
    case 'json':
      parseResult = parseJSONImport(fileContent);
      break;
    case 'csv':
      parseResult = parseCSVImport(fileContent);
      break;
    default:
      return {
        success: false,
        message: `Format file tidak didukung: ${fileType}`,
        importedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        items: []
      };
  }

  if (!parseResult.success) {
    return parseResult;
  }

  // If no validation needed, return parsed items
  if (!options.validateContent) {
    return {
      ...parseResult,
      importedCount: parseResult.items.length,
      message: `${parseResult.items.length} item siap untuk diimport.`
    };
  }

  return parseResult;
}