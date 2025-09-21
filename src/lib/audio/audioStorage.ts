/**
 * IndexedDB Audio Storage System
 * Handles offline storage of audio files for prayers
 */

export interface AudioFile {
  id: string;
  itemId: string; // Reference to prayer item
  type: 'arabic' | 'latin' | 'translation' | 'recitation';
  format: 'mp3' | 'wav' | 'opus' | 'ogg';
  blob: Blob;
  duration?: number;
  size: number;
  createdAt: number;
  lastAccessed: number;
  metadata?: {
    bitrate?: number;
    sampleRate?: number;
    channels?: number;
    quality?: 'low' | 'medium' | 'high';
  };
}

export interface AudioDatabase {
  audioFiles: AudioFile[];
  metadata: {
    version: number;
    totalSize: number;
    lastCleanup: number;
    settings: {
      maxStorageSize: number; // bytes
      autoCleanup: boolean;
      compressionEnabled: boolean;
    };
  };
}

class AudioStorageManager {
  private dbName = 'dashboard-doa-audio';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private maxStorageSize = 100 * 1024 * 1024; // 100MB default

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create audio files store
        if (!db.objectStoreNames.contains('audioFiles')) {
          const audioStore = db.createObjectStore('audioFiles', { keyPath: 'id' });
          audioStore.createIndex('itemId', 'itemId', { unique: false });
          audioStore.createIndex('type', 'type', { unique: false });
          audioStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          const metadataStore = db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  async storeAudioFile(audioFile: Omit<AudioFile, 'id' | 'createdAt' | 'lastAccessed'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const fullAudioFile: AudioFile = {
      ...audioFile,
      id,
      createdAt: now,
      lastAccessed: now,
    };

    // Check storage quota
    await this.checkStorageQuota(audioFile.size);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles', 'metadata'], 'readwrite');
      const audioStore = transaction.objectStore('audioFiles');
      const metadataStore = transaction.objectStore('metadata');

      // Store audio file
      const addRequest = audioStore.add(fullAudioFile);
      addRequest.onerror = () => reject(addRequest.error);

      // Update total size in metadata
      const metadataRequest = metadataStore.get('totalSize');
      metadataRequest.onsuccess = () => {
        const currentSize = metadataRequest.result?.value || 0;
        const newSize = currentSize + audioFile.size;

        metadataStore.put({
          key: 'totalSize',
          value: newSize,
          updatedAt: now
        });
      };

      transaction.oncomplete = () => resolve(id);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getAudioFile(id: string): Promise<AudioFile | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles'], 'readwrite');
      const store = transaction.objectStore('audioFiles');

      const request = store.get(id);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const audioFile = request.result;
        if (audioFile) {
          // Update last accessed time
          audioFile.lastAccessed = Date.now();
          store.put(audioFile);
          resolve(audioFile);
        } else {
          resolve(null);
        }
      };
    });
  }

  async getAudioFilesForItem(itemId: string): Promise<AudioFile[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');
      const index = store.index('itemId');

      const request = index.getAll(itemId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async deleteAudioFile(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles', 'metadata'], 'readwrite');
      const audioStore = transaction.objectStore('audioFiles');
      const metadataStore = transaction.objectStore('metadata');

      // Get file size before deletion
      const getRequest = audioStore.get(id);
      getRequest.onsuccess = () => {
        const audioFile = getRequest.result;
        if (audioFile) {
          // Delete the file
          const deleteRequest = audioStore.delete(id);
          deleteRequest.onerror = () => reject(deleteRequest.error);

          // Update total size
          const metadataRequest = metadataStore.get('totalSize');
          metadataRequest.onsuccess = () => {
            const currentSize = metadataRequest.result?.value || 0;
            const newSize = Math.max(0, currentSize - audioFile.size);

            metadataStore.put({
              key: 'totalSize',
              value: newSize,
              updatedAt: Date.now()
            });
          };
        }
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getAllAudioFiles(): Promise<AudioFile[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');

      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    maxSize: number;
    usagePercentage: number;
    oldestFile?: AudioFile;
    newestFile?: AudioFile;
  }> {
    const allFiles = await this.getAllAudioFiles();
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);

    return {
      totalFiles: allFiles.length,
      totalSize,
      maxSize: this.maxStorageSize,
      usagePercentage: (totalSize / this.maxStorageSize) * 100,
      oldestFile: allFiles.sort((a, b) => a.createdAt - b.createdAt)[0],
      newestFile: allFiles.sort((a, b) => b.createdAt - a.createdAt)[0],
    };
  }

  async cleanup(forceCleanup = false): Promise<number> {
    const stats = await this.getStorageStats();

    // Cleanup if over 80% capacity or forced
    if (stats.usagePercentage < 80 && !forceCleanup) {
      return 0;
    }

    const allFiles = await this.getAllAudioFiles();

    // Sort by last accessed (oldest first)
    const sortedFiles = allFiles.sort((a, b) => a.lastAccessed - b.lastAccessed);

    // Remove oldest 25% of files
    const filesToRemove = sortedFiles.slice(0, Math.floor(allFiles.length * 0.25));

    let deletedCount = 0;
    for (const file of filesToRemove) {
      await this.deleteAudioFile(file.id);
      deletedCount++;
    }

    // Update cleanup timestamp
    await this.updateMetadata('lastCleanup', Date.now());

    return deletedCount;
  }

  private async checkStorageQuota(newFileSize: number): Promise<void> {
    const stats = await this.getStorageStats();

    if (stats.totalSize + newFileSize > this.maxStorageSize) {
      // Try automatic cleanup
      const deletedCount = await this.cleanup(true);

      if (deletedCount === 0) {
        throw new Error('Storage quota exceeded and cleanup failed');
      }

      // Check again after cleanup
      const newStats = await this.getStorageStats();
      if (newStats.totalSize + newFileSize > this.maxStorageSize) {
        throw new Error('Storage quota exceeded even after cleanup');
      }
    }
  }

  private async updateMetadata(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');

      const request = store.put({
        key,
        value,
        updatedAt: Date.now()
      });

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async clearAllAudio(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles', 'metadata'], 'readwrite');

      transaction.objectStore('audioFiles').clear();
      transaction.objectStore('metadata').clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  setMaxStorageSize(sizeInBytes: number): void {
    this.maxStorageSize = sizeInBytes;
  }
}

// Singleton instance
export const audioStorage = new AudioStorageManager();

// Utility functions
export async function storeAudioFromUrl(url: string, itemId: string, type: AudioFile['type']): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);

    const blob = await response.blob();
    const format = getAudioFormatFromBlob(blob) || 'mp3';

    return await audioStorage.storeAudioFile({
      itemId,
      type,
      format,
      blob,
      size: blob.size,
    });
  } catch (error) {
    throw new Error(`Failed to store audio from URL: ${error}`);
  }
}

export function getAudioFormatFromBlob(blob: Blob): AudioFile['format'] | null {
  const mimeType = blob.type.toLowerCase();

  if (mimeType.includes('mp3') || mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  if (mimeType.includes('opus')) return 'opus';
  if (mimeType.includes('ogg')) return 'ogg';

  return null;
}

export async function createObjectURL(audioFile: AudioFile): Promise<string> {
  return URL.createObjectURL(audioFile.blob);
}

export function revokeObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}