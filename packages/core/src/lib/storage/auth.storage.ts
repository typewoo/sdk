export type StorageType = 'localstorage' | 'sessionstorage' | 'memory';
export interface StorageProvider {
  type?: StorageType;
  get: () => Promise<string | null>;
  set: (value: string) => Promise<void>;
  clear: () => Promise<void>;
}

/**
 * Check if we're in a browser environment with localStorage available.
 */
const hasLocalStorage = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  } catch {
    return false;
  }
};

/**
 * Check if we're in a browser environment with sessionStorage available.
 */
const hasSessionStorage = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.sessionStorage !== 'undefined'
    );
  } catch {
    return false;
  }
};

/**
 * In-memory storage provider. Useful for SSR/Node.js environments
 * or when browser storage is not available.
 * @param _key - Unused, but kept for API consistency with other providers.
 */
export const memoryStorageProvider = (_key?: string): StorageProvider => {
  let value: string | null = null;
  return {
    type: 'memory',
    get: () => Promise.resolve(value),
    set: (v: string) => {
      value = v;
      return Promise.resolve();
    },
    clear: () => {
      value = null;
      return Promise.resolve();
    },
  };
};

/**
 * localStorage provider with SSR fallback to in-memory storage.
 */
export const localStorageProvider = (key: string): StorageProvider => {
  if (!hasLocalStorage()) {
    console.warn(
      `[Typewoo] localStorage is not available (SSR/Node.js environment). Falling back to in-memory storage for key "${key}". Data will not persist across page reloads.`
    );
    return memoryStorageProvider();
  }
  return {
    type: 'localstorage',
    get: () => Promise.resolve(localStorage.getItem(key)),
    set: async (value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error(`[Typewoo] Failed to save to localStorage:`, error);
        throw error;
      }
    },
    clear: async () => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`[Typewoo] Failed to clear localStorage:`, error);
        throw error;
      }
    },
  };
};

/**
 * sessionStorage provider with SSR fallback to in-memory storage.
 */
export const sessionStorageProvider = (key: string): StorageProvider => {
  if (!hasSessionStorage()) {
    console.warn(
      `[Typewoo] sessionStorage is not available (SSR/Node.js environment). Falling back to in-memory storage for key "${key}". Data will not persist across page reloads.`
    );
    return memoryStorageProvider();
  }
  return {
    type: 'sessionstorage',
    get: () => Promise.resolve(sessionStorage.getItem(key)),
    set: async (value: string) => {
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.error(`[Typewoo] Failed to save to sessionStorage:`, error);
        throw error;
      }
    },
    clear: async () => {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error(`[Typewoo] Failed to clear sessionStorage:`, error);
        throw error;
      }
    },
  };
};

export const storageProviders = {
  localstorage: localStorageProvider,
  sessionstorage: sessionStorageProvider,
  memory: memoryStorageProvider,
};
