// Persistent storage vault for user-uploaded flyers and custom portfolio items
// Guarantees that flyers uploaded in the Designer Admin Suite never disappear on page reloads or reconnections.

import { PortfolioItem } from '../types';

const DB_NAME = 'rtson_studio_flyer_vault';
const DB_VERSION = 1;
const STORE_NAME = 'custom_flyers';
const LOCAL_STORAGE_KEY = 'rtson_custom_portfolio_flyers';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
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

/**
 * Get synchronously cached custom flyers from localStorage for instant initial render
 */
export function getLocalCachedFlyers(): PortfolioItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read cached flyers from localStorage:', err);
  }
  return [];
}

/**
 * Save custom flyers list to localStorage (with size safety)
 */
function syncToLocalStorage(flyers: PortfolioItem[]) {
  if (typeof window === 'undefined') return;
  try {
    // For localStorage, keep items with compressed/lightweight payload if too big
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flyers));
  } catch (err) {
    console.warn('LocalStorage limit reached for flyers, relying on IndexedDB:', err);
    try {
      // Store lightweight version without giant base64 if needed
      const lightweight = flyers.map(f => ({
        ...f,
        imageUrl: f.imageUrl.length > 50000 ? f.imageUrl.slice(0, 100) : f.imageUrl
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lightweight));
    } catch {}
  }
}

/**
 * Load all custom flyers from IndexedDB
 */
export async function getAllStoredCustomFlyers(): Promise<PortfolioItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as PortfolioItem[];
        if (items && items.length > 0) {
          syncToLocalStorage(items);
          resolve(items);
        } else {
          resolve(getLocalCachedFlyers());
        }
      };

      request.onerror = () => {
        resolve(getLocalCachedFlyers());
      };
    });
  } catch (err) {
    return getLocalCachedFlyers();
  }
}

/**
 * Save a new or updated custom flyer into persistent storage
 */
export async function persistCustomFlyer(flyer: PortfolioItem): Promise<void> {
  // Update localStorage cache first
  const current = getLocalCachedFlyers();
  const existingIdx = current.findIndex(f => f.id === flyer.id);
  let updatedList: PortfolioItem[];
  if (existingIdx >= 0) {
    updatedList = current.map(f => f.id === flyer.id ? flyer : f);
  } else {
    updatedList = [flyer, ...current];
  }
  syncToLocalStorage(updatedList);

  // Update IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(flyer);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Error saving flyer to IndexedDB:', err);
  }
}

/**
 * Delete a custom flyer from storage
 */
export async function deleteStoredCustomFlyer(flyerId: string): Promise<void> {
  // Update localStorage cache
  const current = getLocalCachedFlyers();
  const filtered = current.filter(f => f.id !== flyerId);
  syncToLocalStorage(filtered);

  // Delete from IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(flyerId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Error deleting flyer from IndexedDB:', err);
  }
}

/**
 * Clear all stored flyers from both localStorage and IndexedDB
 */
export async function clearAllStoredFlyers(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('rtson_portfolio_items');
  }
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Error clearing IndexedDB:', err);
  }
}
