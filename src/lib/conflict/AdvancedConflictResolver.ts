import { Item } from '@/types';

export interface ConflictData {
  id: string;
  field: string;
  localValue: any;
  remoteValue: any;
  baseValue?: any;
  timestamp: number;
  conflictType: 'content' | 'deletion' | 'creation' | 'metadata';
  resolution?: ConflictResolution;
}

export interface ConflictResolution {
  strategy: 'local' | 'remote' | 'merge' | 'manual';
  resolvedValue: any;
  timestamp: number;
  notes?: string;
}

export interface MergeResult {
  success: boolean;
  item: Item;
  conflicts: ConflictData[];
  autoResolved: number;
  manualRequired: number;
}

export class AdvancedConflictResolver {
  private conflictHistory: Map<string, ConflictData[]> = new Map();
  private resolutionPreferences: Map<string, 'local' | 'remote' | 'ask'> = new Map();

  constructor() {
    this.loadResolutionPreferences();
  }

  /**
   * Merge two items with advanced conflict detection
   */
  mergeItems(localItem: Item, remoteItem: Item, baseItem?: Item): MergeResult {
    const conflicts: ConflictData[] = [];
    const mergedItem: Item = { ...localItem };
    let autoResolved = 0;
    let manualRequired = 0;

    // Check for conflicts in each field
    const fieldsToCheck: (keyof Item)[] = [
      'title', 'arabic', 'latin', 'translation_id', 'category',
      'tags', 'source', 'favorite', 'updatedAt'
    ];

    for (const field of fieldsToCheck) {
      const localValue = localItem[field];
      const remoteValue = remoteItem[field];
      const baseValue = baseItem?.[field];

      if (this.hasConflict(localValue, remoteValue, baseValue)) {
        const conflict: ConflictData = {
          id: `${localItem.id}_${field}_${Date.now()}`,
          field,
          localValue,
          remoteValue,
          baseValue,
          timestamp: Date.now(),
          conflictType: this.getConflictType(field, localValue, remoteValue)
        };

        const resolution = this.autoResolveConflict(conflict);
        if (resolution) {
          conflict.resolution = resolution;
          mergedItem[field as keyof Item] = resolution.resolvedValue;
          autoResolved++;
        } else {
          manualRequired++;
        }

        conflicts.push(conflict);
      } else {
        // No conflict, use the more recent value
        if (remoteItem.updatedAt > localItem.updatedAt) {
          mergedItem[field as keyof Item] = remoteValue;
        }
      }
    }

    // Store conflicts for history
    if (conflicts.length > 0) {
      this.conflictHistory.set(localItem.id, conflicts);
    }

    return {
      success: manualRequired === 0,
      item: mergedItem,
      conflicts,
      autoResolved,
      manualRequired
    };
  }

  /**
   * Detect if there's a conflict between values
   */
  private hasConflict(localValue: any, remoteValue: any, baseValue?: any): boolean {
    // No conflict if values are the same
    if (this.isEqual(localValue, remoteValue)) {
      return false;
    }

    // If we have a base value, check if both have changed from base
    if (baseValue !== undefined) {
      const localChanged = !this.isEqual(localValue, baseValue);
      const remoteChanged = !this.isEqual(remoteValue, baseValue);
      return localChanged && remoteChanged;
    }

    // Without base, any difference is a potential conflict
    return true;
  }

  /**
   * Determine the type of conflict
   */
  private getConflictType(field: string, localValue: any, remoteValue: any): ConflictData['conflictType'] {
    if (field === 'updatedAt' || field === 'createdAt' || field === 'favorite') {
      return 'metadata';
    }

    if ((localValue === null || localValue === undefined) && remoteValue !== null) {
      return 'creation';
    }

    if ((remoteValue === null || remoteValue === undefined) && localValue !== null) {
      return 'deletion';
    }

    return 'content';
  }

  /**
   * Attempt to automatically resolve conflicts
   */
  private autoResolveConflict(conflict: ConflictData): ConflictResolution | null {
    const { field, localValue, remoteValue, conflictType } = conflict;

    // Check user preferences
    const preference = this.resolutionPreferences.get(field);
    if (preference && preference !== 'ask') {
      return {
        strategy: preference,
        resolvedValue: preference === 'local' ? localValue : remoteValue,
        timestamp: Date.now(),
        notes: `Auto-resolved using user preference: ${preference}`
      };
    }

    // Auto-resolution strategies
    switch (conflictType) {
      case 'metadata':
        return this.resolveMetadataConflict(conflict);

      case 'content':
        return this.resolveContentConflict(conflict);

      case 'creation':
        // Prefer non-null values for creation conflicts
        return {
          strategy: 'merge',
          resolvedValue: localValue || remoteValue,
          timestamp: Date.now(),
          notes: 'Auto-resolved: Preferred non-null value'
        };

      case 'deletion':
        // Deletion conflicts require manual resolution
        return null;

      default:
        return null;
    }
  }

  /**
   * Resolve metadata conflicts (timestamps, favorites, etc.)
   */
  private resolveMetadataConflict(conflict: ConflictData): ConflictResolution | null {
    const { field, localValue, remoteValue } = conflict;

    switch (field) {
      case 'updatedAt':
        // Always use the most recent timestamp
        return {
          strategy: 'merge',
          resolvedValue: Math.max(localValue, remoteValue),
          timestamp: Date.now(),
          notes: 'Auto-resolved: Used most recent timestamp'
        };

      case 'favorite':
        // If either is favorited, keep it favorited
        return {
          strategy: 'merge',
          resolvedValue: localValue || remoteValue,
          timestamp: Date.now(),
          notes: 'Auto-resolved: Kept favorite status if either was favorited'
        };

      default:
        return null;
    }
  }

  /**
   * Resolve content conflicts using smart merging
   */
  private resolveContentConflict(conflict: ConflictData): ConflictResolution | null {
    const { field, localValue, remoteValue } = conflict;

    // For arrays (tags), merge them
    if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
      const mergedArray = Array.from(new Set([...localValue, ...remoteValue]));
      return {
        strategy: 'merge',
        resolvedValue: mergedArray,
        timestamp: Date.now(),
        notes: 'Auto-resolved: Merged arrays and removed duplicates'
      };
    }

    // For strings, prefer longer/more complete content
    if (typeof localValue === 'string' && typeof remoteValue === 'string') {
      if (field === 'arabic' || field === 'translation_id') {
        // For content fields, prefer longer text (more complete)
        const longerValue = localValue.length > remoteValue.length ? localValue : remoteValue;
        return {
          strategy: 'merge',
          resolvedValue: longerValue,
          timestamp: Date.now(),
          notes: 'Auto-resolved: Preferred longer content'
        };
      }
    }

    return null;
  }

  /**
   * Manually resolve a specific conflict
   */
  manualResolveConflict(
    itemId: string,
    conflictId: string,
    resolution: ConflictResolution
  ): boolean {
    const conflicts = this.conflictHistory.get(itemId);
    if (!conflicts) return false;

    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return false;

    conflict.resolution = resolution;
    return true;
  }

  /**
   * Get conflict history for an item
   */
  getConflictHistory(itemId: string): ConflictData[] {
    return this.conflictHistory.get(itemId) || [];
  }

  /**
   * Set resolution preference for a field
   */
  setResolutionPreference(field: string, preference: 'local' | 'remote' | 'ask'): void {
    this.resolutionPreferences.set(field, preference);
    this.saveResolutionPreferences();
  }

  /**
   * Get resolution preference for a field
   */
  getResolutionPreference(field: string): 'local' | 'remote' | 'ask' {
    return this.resolutionPreferences.get(field) || 'ask';
  }

  /**
   * Batch resolve multiple conflicts
   */
  batchResolveConflicts(
    resolutions: Array<{
      itemId: string;
      conflictId: string;
      resolution: ConflictResolution;
    }>
  ): { success: number; failed: number } {
    let success = 0;
    let failed = 0;

    for (const { itemId, conflictId, resolution } of resolutions) {
      if (this.manualResolveConflict(itemId, conflictId, resolution)) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Generate conflict report
   */
  generateConflictReport(): {
    totalConflicts: number;
    byType: Record<ConflictData['conflictType'], number>;
    byField: Record<string, number>;
    autoResolutionRate: number;
  } {
    let totalConflicts = 0;
    let autoResolved = 0;
    const byType: Record<ConflictData['conflictType'], number> = {
      content: 0,
      deletion: 0,
      creation: 0,
      metadata: 0
    };
    const byField: Record<string, number> = {};

    for (const conflicts of this.conflictHistory.values()) {
      for (const conflict of conflicts) {
        totalConflicts++;
        byType[conflict.conflictType]++;
        byField[conflict.field] = (byField[conflict.field] || 0) + 1;

        if (conflict.resolution) {
          autoResolved++;
        }
      }
    }

    return {
      totalConflicts,
      byType,
      byField,
      autoResolutionRate: totalConflicts > 0 ? autoResolved / totalConflicts : 0
    };
  }

  /**
   * Clear conflict history
   */
  clearConflictHistory(itemId?: string): void {
    if (itemId) {
      this.conflictHistory.delete(itemId);
    } else {
      this.conflictHistory.clear();
    }
  }

  /**
   * Utility: Check if two values are equal
   */
  private isEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => this.isEqual(item, b[index]));
    }

    if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => this.isEqual(a[key], b[key]));
    }

    return false;
  }

  /**
   * Save resolution preferences to localStorage
   */
  private saveResolutionPreferences(): void {
    try {
      const preferences = Object.fromEntries(this.resolutionPreferences);
      localStorage.setItem('conflict_resolution_preferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('Failed to save resolution preferences:', error);
    }
  }

  /**
   * Load resolution preferences from localStorage
   */
  private loadResolutionPreferences(): void {
    try {
      const stored = localStorage.getItem('conflict_resolution_preferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        this.resolutionPreferences = new Map(Object.entries(preferences));
      }
    } catch (error) {
      console.warn('Failed to load resolution preferences:', error);
    }
  }
}

// Export singleton instance
export const conflictResolver = new AdvancedConflictResolver();