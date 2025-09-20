// IndexedDB helper for audio storage
export function openAudioDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('app-audio', 1);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putAudioBlob(key: string, blob: Blob): Promise<void> {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tracks', 'readwrite');
    const store = transaction.objectStore('tracks');
    store.put(blob, key);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getAudioBlob(key: string): Promise<Blob | null> {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tracks', 'readonly');
    const store = transaction.objectStore('tracks');
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteAudioBlob(key: string): Promise<void> {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tracks', 'readwrite');
    const store = transaction.objectStore('tracks');
    store.delete(key);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getAllAudioKeys(): Promise<string[]> {
  const db = await openAudioDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tracks', 'readonly');
    const store = transaction.objectStore('tracks');
    const request = store.getAllKeys();

    request.onsuccess = () => resolve(request.result as string[]);
    request.onerror = () => reject(request.error);
  });
}