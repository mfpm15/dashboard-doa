/**
 * Offline functionality utilities
 */

export interface OfflineData {
  items: any[];
  lastSync: number;
  version: string;
}

export interface PendingSync {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

class OfflineManager {
  private dbName = 'dashboard-doa-offline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

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

        // Store for offline data
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'key' });
        }

        // Store for pending sync operations
        if (!db.objectStoreNames.contains('pendingSync')) {
          const syncStore = db.createObjectStore('pendingSync', { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for offline settings
        if (!db.objectStoreNames.contains('offlineSettings')) {
          db.createObjectStore('offlineSettings', { keyPath: 'key' });
        }
      };
    });
  }

  async storeOfflineData(key: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');

      const request = store.put({
        key,
        data,
        timestamp: Date.now()
      });

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async getOfflineData(key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');

      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
    });
  }

  async addPendingSync(operation: Omit<PendingSync, 'id' | 'timestamp'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pendingSync: PendingSync = {
      ...operation,
      id,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');

      const request = store.add(pendingSync);

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async getPendingSyncs(): Promise<PendingSync[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingSync'], 'readonly');
      const store = transaction.objectStore('pendingSync');

      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async removePendingSync(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');

      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async clearPendingSyncs(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingSync'], 'readwrite');
      const store = transaction.objectStore('pendingSync');

      const request = store.clear();

      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => resolve();
    });
  }

  async isOnline(): Promise<boolean> {
    if (!navigator.onLine) {
      return false;
    }

    // Additional connectivity check
    try {
      const response = await fetch('/', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async syncWhenOnline(): Promise<void> {
    if (!(await this.isOnline())) {
      console.log('Still offline, skipping sync');
      return;
    }

    const pendingSyncs = await this.getPendingSyncs();

    if (pendingSyncs.length === 0) {
      console.log('No pending syncs');
      return;
    }

    console.log(`Syncing ${pendingSyncs.length} pending operations`);

    for (const sync of pendingSyncs) {
      try {
        await this.executePendingSync(sync);
        await this.removePendingSync(sync.id);
        console.log(`Synced operation ${sync.id}`);
      } catch (error) {
        console.error(`Failed to sync operation ${sync.id}:`, error);
        // Continue with other syncs
      }
    }
  }

  private async executePendingSync(sync: PendingSync): Promise<void> {
    const { type, data } = sync;

    switch (type) {
      case 'create':
        await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        break;

      case 'update':
        await fetch(`/api/items/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        break;

      case 'delete':
        await fetch(`/api/items/${data.id}`, {
          method: 'DELETE'
        });
        break;

      default:
        throw new Error(`Unknown sync type: ${type}`);
    }
  }

  async enableOfflineMode(): Promise<void> {
    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service worker registered:', registration);

        // Wait for service worker to be ready
        await navigator.serviceWorker.ready;
        console.log('Service worker ready');

        // Store offline mode preference
        await this.storeOfflineData('offlineMode', true);
      } catch (error) {
        console.error('Service worker registration failed:', error);
        throw error;
      }
    } else {
      throw new Error('Service workers not supported');
    }
  }

  async disableOfflineMode(): Promise<void> {
    // Unregister service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();

      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // Clear offline preference
    await this.storeOfflineData('offlineMode', false);
  }

  async isOfflineModeEnabled(): Promise<boolean> {
    try {
      const enabled = await this.getOfflineData('offlineMode');
      return enabled === true;
    } catch {
      return false;
    }
  }

  async getOfflineStats(): Promise<{
    isEnabled: boolean;
    pendingSyncs: number;
    lastSync: number | null;
    cacheSize: number;
  }> {
    const isEnabled = await this.isOfflineModeEnabled();
    const pendingSyncs = (await this.getPendingSyncs()).length;
    const lastSync = await this.getOfflineData('lastSync');

    // Get cache size estimation
    let cacheSize = 0;
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          cacheSize += requests.length;
        }
      } catch (error) {
        console.warn('Could not calculate cache size:', error);
      }
    }

    return {
      isEnabled,
      pendingSyncs,
      lastSync,
      cacheSize
    };
  }
}

// Singleton instance
export const offlineManager = new OfflineManager();

// Connection status utilities
export function getConnectionStatus(): {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
} {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt
  };
}

// Setup offline event listeners
export function setupOfflineListeners(): void {
  window.addEventListener('online', async () => {
    console.log('Connection restored, attempting sync...');
    try {
      await offlineManager.syncWhenOnline();
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  });

  window.addEventListener('offline', () => {
    console.log('Connection lost, entering offline mode');
  });

  // Background sync when page becomes visible
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden && navigator.onLine) {
      try {
        await offlineManager.syncWhenOnline();
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
  });
}

// Auto-retry for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      if (i === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError!;
}
