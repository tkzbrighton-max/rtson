// IndexedDB persistent storage for large Gemini AI videos & motion graphic files (up to 100MB+)

const DB_NAME = 'rtson_studio_video_vault';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

export interface StoredVideoRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  fileName: string;
  sizeBytes: number;
  updatedAt: number;
}

// In-memory cache of object URLs to prevent creating duplicate URLs
const objectUrlCache = new Map<string, string>();

export async function storeLocalVideoBlob(id: string, fileOrBlob: Blob | File, fileName?: string): Promise<string> {
  try {
    const db = await openDB();
    const mimeType = fileOrBlob.type || 'video/mp4';
    const name = fileName || (fileOrBlob instanceof File ? fileOrBlob.name : `gemini_video_${id}.mp4`);

    const record: StoredVideoRecord = {
      id,
      blob: fileOrBlob,
      mimeType,
      fileName: name,
      sizeBytes: fileOrBlob.size,
      updatedAt: Date.now()
    };

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Revoke old cache if any
    if (objectUrlCache.has(id)) {
      URL.revokeObjectURL(objectUrlCache.get(id)!);
    }

    const objectUrl = URL.createObjectURL(fileOrBlob);
    objectUrlCache.set(id, objectUrl);
    return objectUrl;
  } catch (err) {
    console.warn('Failed to store video in IndexedDB:', err);
    // Fallback: create temporary in-memory object URL
    const objectUrl = URL.createObjectURL(fileOrBlob);
    objectUrlCache.set(id, objectUrl);
    return objectUrl;
  }
}

export async function getLocalVideoBlobUrl(id: string): Promise<string | null> {
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }

  try {
    const db = await openDB();
    const record = await new Promise<StoredVideoRecord | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    if (record && record.blob) {
      const objectUrl = URL.createObjectURL(record.blob);
      objectUrlCache.set(id, objectUrl);
      return objectUrl;
    }
    return null;
  } catch (err) {
    console.warn('Could not read video from IndexedDB:', err);
    return null;
  }
}

export async function deleteLocalVideoBlob(id: string): Promise<void> {
  if (objectUrlCache.has(id)) {
    URL.revokeObjectURL(objectUrlCache.get(id)!);
    objectUrlCache.delete(id);
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not delete video from IndexedDB:', err);
  }
}
